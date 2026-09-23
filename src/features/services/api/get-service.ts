import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  getServiceForOwner,
  toServiceDTO,
} from "@/features/services/repository";
import type { ServiceDTO } from "@/features/services/types";

export type GetServiceResult =
  | { ok: true; service: ServiceDTO }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getServiceForCurrentUser(
  siteId: string,
  serviceId: string
): Promise<GetServiceResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const service = await getServiceForOwner(serviceId, siteId, session.user.id);
  if (!service) return { ok: false, error: "not_found" };

  return { ok: true, service: toServiceDTO(service) };
}
