import mongoose from "mongoose";
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
import { SubscriptionModel } from "./subscription.schema";
import { MembershipModel } from "./membership.schema";
import { BillingModel } from "./billing.schema";
import { PhoneIdentityModel } from "./phone-identity.schema";
import { UserReadModel } from "./user.schema";

interface Membership {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** A verified phone number linked to a user account. */
export interface PhoneIdentity {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  phoneNumber: string; // normalized E.164
  verifiedAt: Date;
  createdAt: Date;
}

export async function getSubscriptionForUser(
  userId: string
): Promise<Subscription | null> {
  const userOid = new mongoose.Types.ObjectId(userId);
  const doc = await SubscriptionModel.findOne({ userId: userOid }).lean();
  return (doc as unknown as Subscription) ?? null;
}

export async function upsertSubscription(
  input: CreateSubscriptionInput
): Promise<Subscription> {
  const now = new Date();
  const userOid = new mongoose.Types.ObjectId(input.userId);
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
  const doc = await SubscriptionModel.findOneAndUpdate(
    { userId: userOid },
    { $set: updateDoc, $setOnInsert: { createdAt: now } },
    { upsert: true, new: true }
  ).lean();
  return doc as unknown as Subscription;
}

export async function getAccountStatus(userId: string): Promise<AccountStatus> {
  const userOid = new mongoose.Types.ObjectId(userId);
  const doc = await MembershipModel.findOne({ userId: userOid }).lean();
  if (!doc) return "active";
  return (doc as unknown as Membership).accountStatus;
}

/**
 * Suspends a user's account (e.g. after trial expiration).
 * If no membership record exists, creates one with "suspended" status.
 */
export async function suspendAccount(userId: string): Promise<void> {
  const userOid = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  await MembershipModel.updateOne(
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
  const userOid = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  await MembershipModel.updateOne(
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
  const now = new Date();
  try {
    await PhoneIdentityModel.create({
      userId: new mongoose.Types.ObjectId(userId),
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
  const doc = await PhoneIdentityModel.findOne({ phoneNumber }).lean();
  return (doc as unknown as PhoneIdentity) ?? null;
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
  const userOid = new mongoose.Types.ObjectId(userId);
  const found = await UserReadModel.exists({ _id: userOid });
  return found !== null;
}

export async function appendBillingRecord(
  input: CreateBillingRecordInput
): Promise<BillingRecord> {
  const now = new Date();
  const doc: Omit<BillingRecord, "_id"> = {
    userId: new mongoose.Types.ObjectId(input.userId),
    siteId: input.siteId ? new mongoose.Types.ObjectId(input.siteId) : undefined,
    kind: input.kind,
    amountMinor: input.amountMinor,
    currency: input.currency,
    description: input.description,
    provider: input.provider,
    providerEventId: input.providerEventId,
    createdBy: input.createdBy,
    createdAt: now,
  };
  const created = await BillingModel.create(doc as Omit<BillingRecord, "_id">);
  return { _id: created._id as mongoose.Types.ObjectId, ...doc };
}

export async function listBillingForUser(userId: string): Promise<BillingRecord[]> {
  const userOid = new mongoose.Types.ObjectId(userId);
  const docs = await BillingModel.find({ userId: userOid })
    .sort({ createdAt: -1 })
    .lean();
  return docs as unknown as BillingRecord[];
}

export async function sumBillingForUser(
  userId: string,
  since?: Date
): Promise<CurrencyTotal[]> {
  const match: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  if (since) match.createdAt = { $gte: since };
  const rows = await BillingModel.aggregate<{
    _id: string;
    totalMinor: number;
    count: number;
  }>([
    { $match: match },
    {
      $group: {
        _id: "$currency",
        totalMinor: { $sum: "$amountMinor" },
        count: { $sum: 1 },
      },
    },
  ]);
  return rows.map((r) => ({
    currency: r._id,
    totalMinor: r.totalMinor,
    count: r.count,
  }));
}

export { FREE_PLAN_ID, PRO_PLAN_ID };
