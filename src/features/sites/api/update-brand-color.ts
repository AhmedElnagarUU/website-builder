import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import { isBrandColor } from "@/shared/lib/brand-palette";
import type { SiteDTO } from "@/features/sites/types";

export type UpdateBrandColorResult =
  | { ok: true; site: SiteDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "invalid_color" };

export async function updateBrandColor(
  siteId: string,
  rawBody: unknown
): Promise<UpdateBrandColorResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const color = (rawBody as { color?: unknown } | null)?.color;
  if (!isBrandColor(color)) return { ok: false, error: "invalid_color" };

  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, { brandColor: color, hasUnpublishedChanges });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}
