import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import type {
  AccountStatus,
  BillingRecord,
  CreateBillingRecordInput,
  CreateSubscriptionInput,
  CurrencyTotal,
  Subscription,
  TrialStatus,
} from "./types";
import { FREE_PLAN_ID, PRO_PLAN_ID, TRIAL_DURATION_DAYS } from "./const";

const SUBSCRIPTIONS_COLLECTION = "subscriptions";
const MEMBERSHIPS_COLLECTION = "memberships";
const BILLING_COLLECTION = "billing";
const PHONE_IDENTITIES_COLLECTION = "phoneIdentities";

interface Membership {
  _id: ObjectId;
  userId: ObjectId;
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** A verified phone number linked to a user account. */
export interface PhoneIdentity {
  _id: ObjectId;
  userId: ObjectId;
  phoneNumber: string; // normalized E.164
  verifiedAt: Date;
  createdAt: Date;
}

export async function getSubscriptionForUser(
  userId: string
): Promise<Subscription | null> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const doc = await db
    .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
    .findOne({ userId: userOid });
  return doc ?? null;
}

export async function upsertSubscription(
  input: CreateSubscriptionInput
): Promise<Subscription> {
  const db = await getDb();
  const now = new Date();
  const userOid = new ObjectId(input.userId);
  const updateDoc: Partial<Subscription> = {
    planId: input.planId,
    status: input.status,
    provider: input.provider,
    providerSubscriptionId: input.providerSubscriptionId,
    currency: input.currency,
    amountMinorUnits: input.amountMinorUnits,
    currentPeriodStart: input.currentPeriodStart,
    currentPeriodEnd: input.currentPeriodEnd,
    trialEndsAt: input.trialEndsAt,
    updatedAt: now,
  };
  const existing = await db
    .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
    .findOne({ userId: userOid });
  if (existing) {
    await db
      .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
      .updateOne({ userId: userOid }, { $set: updateDoc });
    const updated = await db
      .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
      .findOne({ userId: userOid });
    return updated!;
  }
  const doc: Omit<Subscription, "_id"> = {
    userId: userOid,
    planId: input.planId,
    status: input.status,
    provider: input.provider,
    providerSubscriptionId: input.providerSubscriptionId,
    currency: input.currency,
    amountMinorUnits: input.amountMinorUnits,
    currentPeriodStart: input.currentPeriodStart,
    currentPeriodEnd: input.currentPeriodEnd,
    trialEndsAt: input.trialEndsAt,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db
    .collection<Omit<Subscription, "_id">>(SUBSCRIPTIONS_COLLECTION)
    .insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function getAccountStatus(userId: string): Promise<AccountStatus> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const doc = await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .findOne({ userId: userOid });
  if (!doc) return "active";
  return doc.accountStatus;
}

/**
 * Suspends a user's account (e.g. after trial expiration).
 * If no membership record exists, creates one with "suspended" status.
 */
export async function suspendAccount(userId: string): Promise<void> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const now = new Date();
  await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .updateOne(
      { userId: userOid },
      {
        $set: { accountStatus: "suspended", updatedAt: now },
        $setOnInsert: { userId: userOid, createdAt: now },
      },
      { upsert: true }
    );
}

/**
 * Clears the suspended status for a user (e.g. after they upgrade).
 */
export async function restoreAccount(userId: string): Promise<void> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const now = new Date();
  await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .updateOne(
      { userId: userOid },
      {
        $set: { accountStatus: "active", updatedAt: now },
        $setOnInsert: { userId: userOid, createdAt: now },
      },
      { upsert: true }
    );
}

/**
 * Stores a verified phone identity. Uses insertOne — the unique
 * index on `phoneNumber` will reject duplicates atomically,
 * preventing race conditions during concurrent signups.
 */
export async function storePhoneIdentity(
  userId: string,
  phoneNumber: string,
  verifiedAt: Date
): Promise<{ success: boolean; duplicate: boolean }> {
  const db = await getDb();
  const now = new Date();
  try {
    await db.collection<PhoneIdentity>(PHONE_IDENTITIES_COLLECTION).insertOne({
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      phoneNumber,
      verifiedAt,
      createdAt: now,
    });
    return { success: true, duplicate: false };
  } catch (err) {
    const isDuplicate =
      err instanceof Error &&
      "code" in err &&
      (err as { code: number }).code === 11000;
    return { success: false, duplicate: !!isDuplicate };
  }
}

/**
 * Looks up a phone identity by normalized phone number.
 */
export async function findPhoneIdentity(
  phoneNumber: string
): Promise<PhoneIdentity | null> {
  const db = await getDb();
  const doc = await db
    .collection<PhoneIdentity>(PHONE_IDENTITIES_COLLECTION)
    .findOne({ phoneNumber });
  return doc ?? null;
}

export async function resolveSubscriptionForUser(
  userId: string
): Promise<Subscription> {
  const existing = await getSubscriptionForUser(userId);
  if (existing) {
    return existing;
  }
  // New user — issue a 15-day free trial on the Free plan.
  const now = new Date();
  const trialEndsAt = new Date(now);
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);
  return upsertSubscription({
    userId,
    planId: FREE_PLAN_ID,
    status: "trialing",
    currentPeriodStart: now,
    currentPeriodEnd: trialEndsAt,
    trialEndsAt,
  });
}

/**
 * Returns the trial status for a user based on their subscription.
 * - If the user has a paid subscription (status "active" without trialEndsAt),
 *   they are not in trial — `hasTrial: false, isActive: false`.
 * - If the subscription has `trialEndsAt`, the trial is active until that date.
 */
export async function getTrialStatus(userId: string): Promise<TrialStatus> {
  const sub = await getSubscriptionForUser(userId);
  if (!sub || !sub.trialEndsAt) {
    // No subscription or no trial end date → either paid user or no account
    return { isActive: false, isExpired: false, expiresAt: null, hasTrial: false };
  }
  const now = new Date();
  const isActive = now < sub.trialEndsAt;
  return {
    isActive,
    isExpired: !isActive,
    expiresAt: sub.trialEndsAt,
    hasTrial: true,
  };
}

/**
 * Enforces trial expiration: if the user's trial has expired, sets
 * `accountStatus` to `"suspended"`. Call this at the start of
 * every protected request (lazily) to catch expirations immediately.
 *
 * Returns the current trial status for convenience.
 */
export async function enforceTrialStatus(userId: string): Promise<TrialStatus> {
  const trial = await getTrialStatus(userId);
  if (trial.isExpired && trial.hasTrial) {
    await suspendAccount(userId);
  }
  return trial;
}

export async function userExists(userId: string): Promise<boolean> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const user = await db.collection("user").findOne({ _id: userOid }, { projection: { _id: 1 } });
  return user !== null;
}

export async function appendBillingRecord(
  input: CreateBillingRecordInput
): Promise<BillingRecord> {
  const db = await getDb();
  const now = new Date();
  const doc: Omit<BillingRecord, "_id"> = {
    userId: new ObjectId(input.userId),
    siteId: input.siteId ? new ObjectId(input.siteId) : undefined,
    kind: input.kind,
    amountMinor: input.amountMinor,
    currency: input.currency,
    description: input.description,
    provider: input.provider,
    providerEventId: input.providerEventId,
    createdBy: input.createdBy,
    createdAt: now,
  };
  const result = await db
    .collection<Omit<BillingRecord, "_id">>(BILLING_COLLECTION)
    .insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function listBillingForUser(userId: string): Promise<BillingRecord[]> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  return db
    .collection<BillingRecord>(BILLING_COLLECTION)
    .find({ userId: userOid })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function sumBillingForUser(
  userId: string,
  since?: Date
): Promise<CurrencyTotal[]> {
  const db = await getDb();
  const match: Record<string, unknown> = { userId: new ObjectId(userId) };
  if (since) match.createdAt = { $gte: since };
  const rows = await db
    .collection<BillingRecord>(BILLING_COLLECTION)
    .aggregate<{ _id: string; totalMinor: number; count: number }>([
      { $match: match },
      {
        $group: {
          _id: "$currency",
          totalMinor: { $sum: "$amountMinor" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();
  return rows.map((r) => ({
    currency: r._id,
    totalMinor: r.totalMinor,
    count: r.count,
  }));
}

export { FREE_PLAN_ID, PRO_PLAN_ID };
