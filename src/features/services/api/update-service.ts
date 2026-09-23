import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  getServiceForOwner,
  toServiceDTO,
  updateService,
} from "@/features/services/repository";
import { updateServiceSchema } from "@/features/services/schemas";
import type { ServiceDTO } from "@/features/services/types";

export type UpdateServiceResult =
  | { ok: true; service: ServiceDTO }
  | {
      ok: false;
      error: "unauthorized" | "not_found" | "validation_error";
    };

export async function updateServiceForCurrentUser(
  siteId: string,
  serviceId: string,
  body: unknown
): Promise<UpdateServiceResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const service = await getServiceForOwner(serviceId, siteId, session.user.id);
  if (!service) return { ok: false, error: "not_found" };

  const parsed = updateServiceSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const updated = await updateService(serviceId, siteId, parsed.data);
  if (!updated) return { ok: false, error: "not_found" };

  return { ok: true, service: toServiceDTO(updated) };
}
