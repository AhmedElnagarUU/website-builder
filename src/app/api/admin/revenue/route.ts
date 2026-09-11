import { NextResponse } from "next/server";
import { getDb } from "@/shared/db/database";

export async function GET(): Promise<NextResponse> {
  const { requireAdminApi } = await import("@/features/admin/lib/roles");
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const db = await getDb();

  const totalUsers = await db.collection("user").countDocuments();

  const totalSites = await db.collection("sites").countDocuments();

  const publishedSites = await db
    .collection("sites")
    .countDocuments({ status: "published" });

  const activeSubscriptions = await db
    .collection("subscriptions")
    .countDocuments({ status: { $in: ["active", "trialing"] } });

  const frozenUsers = await db
    .collection("memberships")
    .countDocuments({ accountStatus: "frozen" });

  const suspendedUsers = await db
    .collection("memberships")
    .countDocuments({ accountStatus: "suspended" });

  const revenueAgg = await db
    .collection("billing")
    .aggregate([
      {
        $group: {
          _id: "$currency",
          totalMinor: { $sum: "$amountMinor" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenueAgg = await db
    .collection("billing")
    .aggregate([
      { $match: { createdAt: { $gte: monthStart } } },
      {
        $group: {
          _id: "$currency",
          totalMinor: { $sum: "$amountMinor" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return NextResponse.json({
    totalUsers,
    totalSites,
    publishedSites,
    activeSubscriptions,
    frozenUsers,
    suspendedUsers,
    revenue: revenueAgg.map((r) => ({
      currency: r._id as string,
      totalMinor: r.totalMinor as number,
      count: r.count as number,
    })),
    monthlyRevenue: monthlyRevenueAgg.map((r) => ({
      currency: r._id as string,
      totalMinor: r.totalMinor as number,
      count: r.count as number,
    })),
  });
}
