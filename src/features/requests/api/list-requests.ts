import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { listRequestsForSite } from "@/features/requests/repository";
import type { ServiceRequestDTO, RequestStatus } from "@/features/requests/types";

export type ListRequestsResult =
  | { ok: true; requests: ServiceRequestDTO[] }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function listRequestsForCurrentUser(
  siteId: string,
  filters?: { status?: RequestStatus; search?: string }
): Promise<ListRequestsResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const requests = await listRequestsForSite(siteId, filters);
  return { ok: true, requests };
}
