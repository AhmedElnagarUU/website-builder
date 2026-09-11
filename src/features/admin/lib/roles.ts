import { redirect } from "next/navigation";
import { getDb } from "@/shared/db/database";
import { ObjectId } from "mongodb";
import type { AdminRole } from "@/features/monetization/types";
import { getAdminRole } from "@/features/monetization/repository";
import { getSession } from "@/features/auth/lib/session";

const MEMBERSHIPS_COLLECTION = "memberships";

interface Membership {
  _id: ObjectId;
  userId: ObjectId;
  accountStatus: string;
  role?: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserRole(userId: string): Promise<AdminRole> {
  return getAdminRole(userId);
}

export function isAdmin(role: AdminRole): boolean {
  return role === "super_admin";
}

export async function requireAdmin(locale: string): Promise<{ userId: string; role: AdminRole }> {
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }
  const role = await getUserRole(session.user.id);
  if (!isAdmin(role)) {
    redirect(`/${locale}/dashboard`);
  }
  return { userId: session.user.id, role };
}

export async function requireAdminApi(): Promise<
  | { ok: true; adminUserId: string }
  | { ok: false; status: 401 | 403; error: string }
> {
  const session = await getSession();
  if (!session) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  const role = await getUserRole(session.user.id);
  if (!isAdmin(role)) {
    return { ok: false, status: 403, error: "forbidden" };
  }
  return { ok: true, adminUserId: session.user.id };
}

export async function listAllUsers(
  query?: string,
  sort?: "createdAt" | "updatedAt",
  page = 1,
  limit = 20
): Promise<{
  users: Array<{
    _id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: AdminRole;
    accountStatus: string;
    planId: string;
    subscriptionStatus: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}> {
  const db = await getDb();

  const filter: Record<string, unknown> = {};
  if (query) {
    const regex = { $regex: query, $options: "i" };
    filter.$or = [{ email: regex }, { name: regex }];
  }

  const total = await db.collection("user").countDocuments(filter);
  const skip = (page - 1) * limit;

  const userDocs = await db
    .collection("user")
    .find(filter)
    .sort({ [sort || "createdAt"]: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const userIds = userDocs.map((u) => u._id);

  const memberships = await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .find({ userId: { $in: userIds } })
    .toArray();

  const subscriptions = await db
    .collection("subscriptions")
    .find({ userId: { $in: userIds } })
    .toArray();

  const membershipMap = new Map(memberships.map((m) => [m.userId.toString(), m]));
  const subscriptionMap = new Map(subscriptions.map((s) => [s.userId.toString(), s]));

  return {
    users: userDocs.map((u) => {
      const uid = u._id.toString();
      const membership = membershipMap.get(uid);
      const subscription = subscriptionMap.get(uid);
      return {
        _id: uid,
        email: u.email as string,
        name: (u.name as string) ?? null,
        createdAt: u.createdAt as Date,
        updatedAt: u.updatedAt as Date,
        role: membership?.role ?? "user",
        accountStatus: membership?.accountStatus ?? "active",
        planId: (subscription?.planId as string) ?? "free",
        subscriptionStatus: (subscription?.status as string) ?? "active",
      };
    }),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserDetail(userId: string): Promise<{
  _id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  accountStatus: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: {
    planId: string;
    status: string;
    currency?: string;
    amountMinorUnits?: number;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  } | null;
  sites: { total: number; published: number };
  billing: {
    records: Array<{
      _id: string;
      kind: string;
      amountMinor: number;
      currency: string;
      description?: string;
      createdAt: Date;
    }>;
    totals: Array<{ currency: string; totalMinor: number; count: number }>;
  };
} | null> {
  const db = await getDb();
  const { ObjectId: Oid } = await import("mongodb");

  if (!Oid.isValid(userId)) return null;

  const userOid = new Oid(userId);
  const user = await db.collection("user").findOne({ _id: userOid });
  if (!user) return null;

  const membership = await db
    .collection<Membership>(MEMBERSHIPS_COLLECTION)
    .findOne({ userId: userOid });

  const subscription = await db
    .collection("subscriptions")
    .findOne({ userId: userOid });

  const sites = await db
    .collection("sites")
    .find({ ownerId: userOid })
    .toArray();

  const publishedCount = sites.filter((s) => s.status === "published").length;

  const billingRecords = await db
    .collection("billing")
    .find({ userId: userOid })
    .sort({ createdAt: -1 })
    .toArray();

  const billingAgg = await db
    .collection("billing")
    .aggregate([
      { $match: { userId: userOid } },
      {
        $group: {
          _id: "$currency",
          totalMinor: { $sum: "$amountMinor" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return {
    _id: userId,
    email: user.email as string,
    name: (user.name as string) ?? null,
    role: membership?.role ?? "user",
    accountStatus: membership?.accountStatus ?? "active",
    createdAt: user.createdAt as Date,
    updatedAt: user.updatedAt as Date,
    subscription: subscription
      ? {
          planId: subscription.planId as string,
          status: subscription.status as string,
          currency: subscription.currency as string | undefined,
          amountMinorUnits: subscription.amountMinorUnits as number | undefined,
          currentPeriodStart: subscription.currentPeriodStart as Date | undefined,
          currentPeriodEnd: subscription.currentPeriodEnd as Date | undefined,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd as boolean | undefined,
        }
      : null,
    sites: { total: sites.length, published: publishedCount },
    billing: {
      records: billingRecords.map((r) => ({
        _id: r._id.toString(),
        kind: r.kind as string,
        amountMinor: r.amountMinor as number,
        currency: r.currency as string,
        description: r.description as string | undefined,
        createdAt: r.createdAt as Date,
      })),
      totals: billingAgg.map((r) => ({
        currency: r._id as string,
        totalMinor: r.totalMinor as number,
        count: r.count as number,
      })),
    },
  };
}
