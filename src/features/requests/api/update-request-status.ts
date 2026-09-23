import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { getRequestForOwner, updateRequestStatus } from "@/features/requests/repository";
import { updateRequestStatusSchema } from "@/features/requests/schemas";

export type UpdateRequestStatusResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function updateRequestStatusForCurrentUser(
  siteId: string,
  requestId: string,
  body: unknown
): Promise<UpdateRequestStatusResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  // Verify request belongs to this site and user
  const request = await getRequestForOwner(requestId, siteId, session.user.id);
  if (!request) return { ok: false, error: "not_found" };

  const parsed = updateRequestStatusSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  await updateRequestStatus(requestId, siteId, parsed.data.status, session.user.id);
  return { ok: true };
}
