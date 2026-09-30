import { requireSiteOwner } from "@/features/business-content/api/require-site-owner";
import {
  listBusinessItemsForSite,
  toBusinessItemDTO,
} from "@/features/business-content/repository";
import { listBusinessItemsQuerySchema } from "@/features/business-content/schemas";
import type { BusinessItemDTO } from "@/features/business-content/types";

export type ListBusinessItemsResult =
  | { ok: true; items: BusinessItemDTO[] }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function listBusinessItemsForCurrentUser(
  siteId: string,
  query: {
    kind?: string;
    locale?: string;
    includeInactive?: string;
  }
): Promise<ListBusinessItemsResult> {
  const gate = await requireSiteOwner(siteId);
  if (!gate.ok) return gate;

  const parsed = listBusinessItemsQuerySchema.safeParse(query);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const items = await listBusinessItemsForSite({
    siteId,
    ownerId: gate.ownerId,
    kind: parsed.data.kind,
    locale: parsed.data.locale,
    includeInactive: parsed.data.includeInactive === "true",
  });

  return { ok: true, items: items.map(toBusinessItemDTO) };
}
