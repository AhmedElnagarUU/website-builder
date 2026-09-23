import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { getRequestForOwner, resolveRequestDTO } from "@/features/requests/repository";
import type { ServiceRequestDTO } from "@/features/requests/types";

export type GetRequestResult =
  | { ok: true; request: ServiceRequestDTO }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getRequestForCurrentUser(
  siteId: string,
  requestId: string
): Promise<GetRequestResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const request = await getRequestForOwner(requestId, siteId, session.user.id);
  if (!request) return { ok: false, error: "not_found" };

  const dto = await resolveRequestDTO(request);
  return { ok: true, request: dto };
}
