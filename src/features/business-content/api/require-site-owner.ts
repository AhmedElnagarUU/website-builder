import mongoose from "mongoose";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";

export type SiteOwnerGate =
  | { ok: true; ownerId: string }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function requireSiteOwner(siteId: string): Promise<SiteOwnerGate> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  if (!mongoose.Types.ObjectId.isValid(siteId)) {
    return { ok: false, error: "not_found" };
  }

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  return { ok: true, ownerId: session.user.id };
}
