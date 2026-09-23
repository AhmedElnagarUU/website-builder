import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  countCustomersForSite,
  countNewCustomersForSite,
} from "@/features/customers/repository";
import {
  countRequestsByStatus,
  countNewRequestsForSite,
  countCompletedRequestsForSite,
  listRecentRequestsForSite,
} from "@/features/requests/repository";
import type { DashboardOverview } from "@/features/requests/types";

export type GetOverviewResult =
  | { ok: true; data: DashboardOverview }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getOverviewForCurrentUser(
  siteId: string
): Promise<GetOverviewResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    totalCustomers,
    newCustomers,
    requestStats,
    newRequests,
    completedRequests,
    recentRequests,
  ] = await Promise.all([
    countCustomersForSite(siteId),
    countNewCustomersForSite(siteId, since),
    countRequestsByStatus(siteId),
    countNewRequestsForSite(siteId, since),
    countCompletedRequestsForSite(siteId),
    listRecentRequestsForSite(siteId, 10),
  ]);

  const data: DashboardOverview = {
    totalCustomers,
    newCustomers,
    totalRequests: requestStats.total,
    newRequests,
    completedRequests,
    recentRequests,
  };

  return { ok: true, data };
}
