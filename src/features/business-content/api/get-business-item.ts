import { requireSiteOwner } from "@/features/business-content/api/require-site-owner";
import {
  getBusinessItemForOwner,
  toBusinessItemDTO,
} from "@/features/business-content/repository";
import type { BusinessItemDTO } from "@/features/business-content/types";

export type GetBusinessItemResult =
  | { ok: true; item: BusinessItemDTO }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getBusinessItemForCurrentUser(
  siteId: string,
  itemId: string
): Promise<GetBusinessItemResult> {
  const gate = await requireSiteOwner(siteId);
  if (!gate.ok) return gate;

  const item = await getBusinessItemForOwner(itemId, siteId, gate.ownerId);
  if (!item) return { ok: false, error: "not_found" };

  return { ok: true, item: toBusinessItemDTO(item) };
}
