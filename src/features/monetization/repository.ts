import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import type {
  AccountStatus,
  AdminRole,
  BillingFilters,
  BillingRecord,
  CreateBillingRecordInput,
  CreateSubscriptionInput,
  CurrencyTotal,
  Subscription,
  SubscriptionStatus,
} from "./types";
import { FREE_PLAN_ID, PRO_PLAN_ID } from "./const";

const SUBSCRIPTIONS_COLLECTION = "subscriptions";
const MEMBERSHIPS_COLLECTION = "memberships";
const BILLING_COLLECTION = "billing";

interface Membership {
  _id: ObjectId;
  userId: ObjectId;
  accountStatus: AccountStatus;
  role?: AdminRole;
  createdAt: Date;
  updatedAt: Date;
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
    createdAt: now,
    updatedAt: now,
  };
  const result = await db
    .collection<Omit<Subscription, "_id">>(SUBSCRIPTIONS_COLLECTION)
    .insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function setSubscriptionStatus(
  userId: string,
  status: SubscriptionStatus
): Promise<void> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  await db
    .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
    .updateOne(
      { userId: userOid },
      { $set: { status, updatedAt: new Date() } }
    );
}

export async function setSubscriptionPlan(
  userId: string,
  planId: "free" | "pro"
): Promise<void> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  await db
    .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
    .updateOne(
      { userId: userOid },
      { $set: { planId, updatedAt: new Date() } }
    );
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

export async function setAccountStatus(
  userId: string,
  status: AccountStatus
): Promise<void> {
  const db = await getDb();
  const now = new Date();
  const userOid = new ObjectId(userId);
  const existing = await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .findOne({ userId: userOid });
  if (existing) {
    await db
      .collection<Membership>(MEMBERSHIPS_COLLECTION)
      .updateOne(
        { userId: userOid },
        { $set: { accountStatus: status, updatedAt: now } }
      );
    return;
  }
  await db.collection<Omit<Membership, "_id">>(MEMBERSHIPS_COLLECTION).insertOne({
    userId: userOid,
    accountStatus: status,
    role: "user",
    createdAt: now,
    updatedAt: now,
  });
}

export async function getAdminRole(userId: string): Promise<AdminRole> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const doc = await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .findOne({ userId: userOid });
  return doc?.role ?? "user";
}

export async function resolveSubscriptionForUser(
  userId: string
): Promise<Subscription> {
  const existing = await getSubscriptionForUser(userId);
  if (existing) {
    return existing;
  }
  return upsertSubscription({
    userId,
    planId: FREE_PLAN_ID,
    status: "active",
  });
}

export async function ensureAllUsersHaveFreePlan(): Promise<{
  created: number;
}> {
  const db = await getDb();
  const users = await db.collection("user").find({}).toArray();
  let created = 0;
  for (const user of users) {
    const userId = user._id.toString();
    const sub = await getSubscriptionForUser(userId);
    if (!sub) {
      await upsertSubscription({
        userId,
        planId: FREE_PLAN_ID,
        status: "active",
      });
      created += 1;
    }
    const membership = await db
      .collection<Membership>(MEMBERSHIPS_COLLECTION)
      .findOne({ userId: user._id });
    if (!membership) {
      await setAccountStatus(userId, "active");
    }
  }
  return { created };
}

export async function userExists(userId: string): Promise<boolean> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const user = await db.collection("user").findOne({ _id: userOid }, { projection: { _id: 1 } });
  return user !== null;
}

export interface AdminSetSubscriptionInput {
  planId: "free" | "pro";
  status: SubscriptionStatus;
  currency?: string;
  amountMinor?: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd?: boolean;
}

export async function adminSetSubscription(
  userId: string,
  input: AdminSetSubscriptionInput
): Promise<Subscription> {
  const db = await getDb();
  const now = new Date();
  const userOid = new ObjectId(userId);
  const fields: Partial<Subscription> = {
    planId: input.planId,
    status: input.status,
    provider: "manual",
    providerSubscriptionId: undefined,
    currency: input.currency,
    amountMinorUnits: input.amountMinor,
    currentPeriodStart: input.currentPeriodStart,
    currentPeriodEnd: input.currentPeriodEnd,
    trialEndsAt: input.trialEndsAt,
    cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    updatedAt: now,
  };
  const existing = await db
    .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
    .findOne({ userId: userOid });
  if (existing) {
    await db
      .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
      .updateOne({ userId: userOid }, { $set: fields });
    const updated = await db
      .collection<Subscription>(SUBSCRIPTIONS_COLLECTION)
      .findOne({ userId: userOid });
    return updated!;
  }
  const doc: Omit<Subscription, "_id"> = {
    userId: userOid,
    planId: input.planId,
    status: input.status,
    provider: "manual",
    currency: input.currency,
    amountMinorUnits: input.amountMinor,
    currentPeriodStart: input.currentPeriodStart,
    currentPeriodEnd: input.currentPeriodEnd,
    trialEndsAt: input.trialEndsAt,
    cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db
    .collection<Omit<Subscription, "_id">>(SUBSCRIPTIONS_COLLECTION)
    .insertOne(doc);
  return { _id: result.insertedId, ...doc };
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

export async function listBillingByAdmin(
  adminUserId: string,
  filters?: BillingFilters
): Promise<BillingRecord[]> {
  const db = await getDb();
  const query: Record<string, unknown> = { createdBy: adminUserId };
  if (filters?.kind) query.kind = filters.kind;
  if (filters?.provider) query.provider = filters.provider;
  if (filters?.since) query.createdAt = { $gte: filters.since };
  return db
    .collection<BillingRecord>(BILLING_COLLECTION)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}

export { FREE_PLAN_ID, PRO_PLAN_ID };
