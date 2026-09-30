import mongoose from "mongoose";
import { requireSiteOwner } from "@/features/business-content/api/require-site-owner";
import {
  getBusinessItemForOwner,
  toBusinessItemDTO,
  updateBusinessItem,
} from "@/features/business-content/repository";
import { updateBusinessItemSchema } from "@/features/business-content/schemas";
import type { BusinessItemData, BusinessItemDTO } from "@/features/business-content/types";

export type UpdateBusinessItemResult =
  | { ok: true; item: BusinessItemDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function updateBusinessItemForCurrentUser(
  siteId: string,
  itemId: string,
  body: unknown
): Promise<UpdateBusinessItemResult> {
  const gate = await requireSiteOwner(siteId);
  if (!gate.ok) return gate;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return { ok: false, error: "not_found" };
  }

  const existing = await getBusinessItemForOwner(itemId, siteId, gate.ownerId);
  if (!existing) return { ok: false, error: "not_found" };

  const parsed = updateBusinessItemSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  if (parsed.data.kind !== existing.kind) {
    return { ok: false, error: "validation_error" };
  }

  const updated = await updateBusinessItem(itemId, siteId, gate.ownerId, {
    data: parsed.data.data as BusinessItemData | undefined,
    active: parsed.data.active,
    sortOrder: parsed.data.sortOrder,
    origin: "user",
    edited: true,
  });
  if (!updated) return { ok: false, error: "not_found" };

  return { ok: true, item: toBusinessItemDTO(updated) };
}
