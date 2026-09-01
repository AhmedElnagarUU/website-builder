import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import type { SiteDTO } from "@/features/sites/types";

export type UnpublishSiteResult =
  | { ok: true; site: SiteDTO }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function unpublishSite(siteId: string): Promise<UnpublishSiteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  // Idempotent by design: setting status to "unpublished" is harmless even if
  // the site is already draft/unpublished, and never touches publishedSnapshot.
  const updated = await updateSite(siteId, { status: "unpublished" });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}