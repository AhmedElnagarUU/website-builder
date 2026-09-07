import type { SiteAnalyticsSummary } from "../types";
import { listSitePageviewDays } from "../repository";
import { getSiteForOwner } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";

export type GetAnalyticsResult =
  | { ok: true; data: SiteAnalyticsSummary }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getSiteAnalytics(
  siteId: string
): Promise<GetAnalyticsResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const now = new Date();
  const d30 = new Date(now);
  d30.setDate(d30.getDate() - 30);
  const d7 = new Date(now);
  d7.setDate(d7.getDate() - 7);
  const from30 = d30.toISOString().slice(0, 10);
  const from7 = d7.toISOString().slice(0, 10);

  const allDays = await listSitePageviewDays(siteId);

  let totalViews = 0;
  let last7Views = 0;
  let last30Views = 0;
  for (const d of allDays) {
    totalViews += d.views;
    if (d.date >= from30) last30Views += d.views;
    if (d.date >= from7) last7Views += d.views;
  }

  const perPageMap = new Map<
    string,
    { page: string; locale: string; views: number }
  >();
  for (const d of allDays) {
    const key = `${d.page}:${d.locale}`;
    const existing = perPageMap.get(key);
    if (existing) {
      existing.views += d.views;
    } else {
      perPageMap.set(key, {
        page: d.page,
        locale: d.locale,
        views: d.views,
      });
    }
  }
  const perPage = Array.from(perPageMap.values()).sort(
    (a, b) => b.views - a.views
  );

  const trendMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    trendMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const d of allDays) {
    if (trendMap.has(d.date)) {
      trendMap.set(d.date, (trendMap.get(d.date) ?? 0) + d.views);
    }
  }
  const trend = Array.from(trendMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    ok: true,
    data: {
      totalViews,
      last7Days: last7Views,
      last30Days: last30Views,
      perPage,
      trend,
    },
  };
}
