import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  deleteService,
  getServiceForOwner,
  hasRequestsForService,
} from "@/features/services/repository";

export type DeleteServiceResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" | "conflict" };

export async function deleteServiceForCurrentUser(
  siteId: string,
  serviceId: string
): Promise<DeleteServiceResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const service = await getServiceForOwner(serviceId, siteId, session.user.id);
  if (!service) return { ok: false, error: "not_found" };

  if (await hasRequestsForService(serviceId)) {
    return { ok: false, error: "conflict" };
  }

  await deleteService(serviceId, siteId);
  return { ok: true };
}
