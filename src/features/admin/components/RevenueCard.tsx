"use client";

import { useTranslations } from "next-intl";

interface RevenueCardProps {
  totalUsers: number;
  totalSites: number;
  publishedSites: number;
  activeSubscriptions: number;
  frozenUsers: number;
  suspendedUsers: number;
  revenue: Array<{ currency: string; totalMinor: number; count: number }>;
  monthlyRevenue: Array<{ currency: string; totalMinor: number; count: number }>;
}

export function RevenueCard({ data }: { data: RevenueCardProps }) {
  const t = useTranslations("admin.overview");

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label={t("total_users")} value={data.totalUsers} />
      <StatCard label={t("total_sites")} value={data.totalSites} />
      <StatCard label={t("published_sites")} value={data.publishedSites} />
      <StatCard label={t("active_subscriptions")} value={data.activeSubscriptions} />
      <StatCard label={t("frozen_accounts")} value={data.frozenUsers} />
      <StatCard label={t("suspended_accounts")} value={data.suspendedUsers} />
      {data.revenue.map((r) => (
        <StatCard
          key={r.currency}
          label={t("revenue", { currency: r.currency })}
          value={`${(r.totalMinor / 100).toFixed(2)} ${r.currency}`}
        />
      ))}
      {data.monthlyRevenue.map((r) => (
        <StatCard
          key={`monthly-${r.currency}`}
          label={t("monthly_revenue", { currency: r.currency })}
          value={`${(r.totalMinor / 100).toFixed(2)} ${r.currency}`}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-5 shadow-mono">
      <p className="font-serif2 text-sm text-ink-2">{label}</p>
      <p className="mono-display mt-1 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
