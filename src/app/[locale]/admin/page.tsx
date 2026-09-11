import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/shared/i18n/config";
import { notFound } from "next/navigation";
import { getDb } from "@/shared/db/database";
import { RevenueCard } from "@/features/admin/components/RevenueCard";

async function getOverviewData() {
  const db = await getDb();

  const totalUsers = await db.collection("user").countDocuments();
  const totalSites = await db.collection("sites").countDocuments();
  const publishedSites = await db.collection("sites").countDocuments({ status: "published" });
  const activeSubscriptions = await db
    .collection("subscriptions")
    .countDocuments({ status: { $in: ["active", "trialing"] } });
  const frozenUsers = await db.collection("memberships").countDocuments({ accountStatus: "frozen" });
  const suspendedUsers = await db.collection("memberships").countDocuments({ accountStatus: "suspended" });

  const revenue = await db
    .collection("billing")
    .aggregate([
      { $group: { _id: "$currency", totalMinor: { $sum: "$amountMinor" }, count: { $sum: 1 } } },
    ])
    .toArray();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyRevenue = await db
    .collection("billing")
    .aggregate([
      { $match: { createdAt: { $gte: monthStart } } },
      { $group: { _id: "$currency", totalMinor: { $sum: "$amountMinor" }, count: { $sum: 1 } } },
    ])
    .toArray();

  return {
    totalUsers,
    totalSites,
    publishedSites,
    activeSubscriptions,
    frozenUsers,
    suspendedUsers,
    revenue: revenue.map((r) => ({ currency: r._id as string, totalMinor: r.totalMinor as number, count: r.count as number })),
    monthlyRevenue: monthlyRevenue.map((r) => ({ currency: r._id as string, totalMinor: r.totalMinor as number, count: r.count as number })),
  };
}

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getOverviewData();

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mono-display mb-8 text-5xl font-bold leading-none tracking-tight text-ink">
        Overview
      </h1>
      <RevenueCard data={data} />
    </section>
  );
}
