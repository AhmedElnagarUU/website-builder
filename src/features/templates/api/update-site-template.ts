import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import { getTemplate } from "@/features/templates/api/list-templates";
import type { SiteDTO } from "@/features/sites/types";

export type UpdateSiteTemplateResult =
  | { ok: true; site: SiteDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "invalid_template" };

export async function updateSiteTemplate(
  siteId: string,
  templateId: string
): Promise<UpdateSiteTemplateResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const template = getTemplate(templateId);
  if (!template) return { ok: false, error: "invalid_template" };

  const brandColor = site.brandColor === "" ? template.colors.defaultAccent : site.brandColor;
  const hasUnpublishedChanges = site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, {
    templateId,
    brandColor,
    hasUnpublishedChanges,
  });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}