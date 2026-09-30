import { z } from "zod";
import { requireSiteOwner } from "@/features/business-content/api/require-site-owner";
import { countEditedItems } from "@/features/business-content/repository";
import {
  businessItemKindSchema,
  localeSchema,
} from "@/features/business-content/schemas";

/**
 * THE CONFIRM-GATE SEAM. `count > 0` means "this site has catalog items the AI is not
 * allowed to overwrite" — EPIC 5's regeneration confirm-gate adds this to the existing
 * `countEditedFields(site)` / `userEditedCount > 0` check in
 * `features/regeneration/api/regenerate-impact.ts` and warns before passing `force: true`
 * to `mergeBusinessItems`.
 */
export type CountEditedItemsResult =
  | { ok: true; count: number }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

const countEditedItemsQuerySchema = z.object({
  kind: businessItemKindSchema.optional(),
  locale: localeSchema.optional(),
});

export async function countEditedItemsForCurrentUser(
  siteId: string,
  query: {
    kind?: string;
    locale?: string;
  }
): Promise<CountEditedItemsResult> {
  const gate = await requireSiteOwner(siteId);
  if (!gate.ok) return gate;

  const parsed = countEditedItemsQuerySchema.safeParse(query);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const count = await countEditedItems(siteId, gate.ownerId, {
    kind: parsed.data.kind,
    locale: parsed.data.locale,
  });

  return { ok: true, count };
}
