import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  countServicesForSite,
  createService,
  toServiceDTO,
} from "@/features/services/repository";
import { createServiceSchema } from "@/features/services/schemas";
import type { ServiceDTO } from "@/features/services/types";

export type CreateServiceResult =
  | { ok: true; service: ServiceDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function createServiceForCurrentUser(
  siteId: string,
  body: unknown
): Promise<CreateServiceResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = createServiceSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const existingCount = await countServicesForSite(siteId);
  const sortOrder = parsed.data.sortOrder ?? existingCount;

  const service = await createService({
    siteId,
    ownerId: session.user.id,
    name: parsed.data.name,
    description: parsed.data.description ?? "",
    sortOrder,
  });

  return { ok: true, service: toServiceDTO(service) };
}
