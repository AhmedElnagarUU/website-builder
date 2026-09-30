import { requireSiteOwner } from "@/features/business-content/api/require-site-owner";
import {
  createBusinessItem,
  getMaxBusinessItemSortOrder,
  toBusinessItemDTO,
} from "@/features/business-content/repository";
import { createBusinessItemSchema } from "@/features/business-content/schemas";
import type { BusinessItemDTO } from "@/features/business-content/types";

export type CreateBusinessItemResult =
  | { ok: true; item: BusinessItemDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" | "conflict" };

export async function createBusinessItemForCurrentUser(
  siteId: string,
  body: unknown
): Promise<CreateBusinessItemResult> {
  const gate = await requireSiteOwner(siteId);
  if (!gate.ok) return gate;

  const parsed = createBusinessItemSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const sortOrder =
    parsed.data.sortOrder ??
    (await getMaxBusinessItemSortOrder(siteId, gate.ownerId, parsed.data.kind)) + 1;

  const item = await createBusinessItem({
    siteId,
    ownerId: gate.ownerId,
    kind: parsed.data.kind,
    locale: parsed.data.locale,
    baseKey: parsed.data.baseKey,
    data: parsed.data.data,
    active: parsed.data.active,
    sortOrder,
    origin: "user",
    edited: false,
  });

  if (!item) return { ok: false, error: "conflict" };

  return { ok: true, item: toBusinessItemDTO(item) };
}
