import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import type {
  AccountStatus,
  BillingRecord,
  CreateBillingRecordInput,
  CreateSubscriptionInput,
  CurrencyTotal,
  Subscription,
} from "./types";
import { FREE_PLAN_ID, PRO_PLAN_ID } from "./const";

const SUBSCRIPTIONS_COLLECTION = "subscriptions";
const MEMBERSHIPS_COLLECTION = "memberships";
const BILLING_COLLECTION = "billing";

interface Membership {
  _id: ObjectId;
  userId: ObjectId;
  accountStatus: AccountStatus;
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

export async function getAccountStatus(userId: string): Promise<AccountStatus> {
  const db = await getDb();
  const userOid = new ObjectId(userId);
  const doc = await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .findOne({ userId: userOid });
  if (!doc) return "active";
  return doc.accountStatus;
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
