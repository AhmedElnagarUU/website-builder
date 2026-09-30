import mongoose from "mongoose";
import { requireSiteOwner } from "@/features/business-content/api/require-site-owner";
import { deleteBusinessItem } from "@/features/business-content/repository";

export type DeleteBusinessItemResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function deleteBusinessItemForCurrentUser(
  siteId: string,
  itemId: string
): Promise<DeleteBusinessItemResult> {
  const gate = await requireSiteOwner(siteId);
  if (!gate.ok) return gate;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return { ok: false, error: "not_found" };
  }

  const deleted = await deleteBusinessItem(itemId, siteId, gate.ownerId);
  if (!deleted) return { ok: false, error: "not_found" };

  return { ok: true };
}
