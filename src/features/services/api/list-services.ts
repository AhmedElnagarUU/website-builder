import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  listAllServicesForSite,
  listServicesForSite,
  toServiceDTO,
} from "@/features/services/repository";
import type { ServiceDTO } from "@/features/services/types";

export type ListServicesResult =
  | { ok: true; services: ServiceDTO[] }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function listServicesForCurrentUser(
  siteId: string,
  includeInactive: boolean
): Promise<ListServicesResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const services = includeInactive
    ? await listAllServicesForSite(siteId)
    : await listServicesForSite(siteId);

  return { ok: true, services: services.map(toServiceDTO) };
}
