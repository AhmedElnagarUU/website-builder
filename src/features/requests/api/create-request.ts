import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  createRequest,
  resolveRequestDTO,
} from "@/features/requests/repository";
import { createRequestFromDashboardSchema } from "@/features/requests/schemas";
import { getCustomerForOwner } from "@/features/customers/repository";
import { getServiceForOwner } from "@/features/services/repository";
import type { ServiceRequestDTO } from "@/features/requests/types";

export type CreateRequestResult =
  | { ok: true; request: ServiceRequestDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function createRequestForCurrentUser(
  siteId: string,
  body: unknown
): Promise<CreateRequestResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = createRequestFromDashboardSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const { customerId, serviceId, message } = parsed.data;

  // Verify customer belongs to this site and user
  const customer = await getCustomerForOwner(customerId, siteId, session.user.id);
  if (!customer) return { ok: false, error: "not_found" };

  // If serviceId provided, verify it belongs to the site (not necessarily active —
  // a business owner may create a request for a previously-offered service)
  if (serviceId) {
    const service = await getServiceForOwner(serviceId, siteId, session.user.id);
    if (!service) return { ok: false, error: "not_found" };
  }

  const request = await createRequest({
    siteId,
    ownerId: session.user.id,
    customerId,
    serviceId: serviceId ?? null,
    message: message ?? "",
  });

  const dto = await resolveRequestDTO(request);
  return { ok: true, request: dto };
}
