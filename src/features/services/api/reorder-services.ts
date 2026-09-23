import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  countServicesByIds,
  reorderServices,
} from "@/features/services/repository";
import { reorderServicesSchema } from "@/features/services/schemas";

export type ReorderServicesResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function reorderServicesForCurrentUser(
  siteId: string,
  body: unknown
): Promise<ReorderServicesResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = reorderServicesSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const { orderedIds } = parsed.data;

  const matchedCount = await countServicesByIds(siteId, orderedIds);
  if (matchedCount !== orderedIds.length) {
    return { ok: false, error: "validation_error" };
  }

  await reorderServices(siteId, orderedIds);
  return { ok: true };
}
