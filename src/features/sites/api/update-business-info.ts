import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import { businessInfoPatchSchema } from "@/features/sites/schemas";
import type { SiteBusinessInfo, SiteDTO, WizardStep } from "@/features/sites/types";

export type UpdateBusinessInfoResult =
  | { ok: true; site: SiteDTO }
  | {
      ok: false;
      error: "unauthorized" | "not_found" | "validation_error" | "missing_required_fields";
    };

export async function updateBusinessInfo(
  siteId: string,
  rawBody: unknown
): Promise<UpdateBusinessInfoResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = businessInfoPatchSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, error: "validation_error" };
  }
  const patch = parsed.data;

  const mergedBusinessInfo: SiteBusinessInfo = {
    ...site.businessInfo,
  };
  if (patch.name !== undefined) mergedBusinessInfo.name = patch.name;
  if (patch.category !== undefined) mergedBusinessInfo.category = patch.category;
  if (patch.description !== undefined) mergedBusinessInfo.description = patch.description;
  if (patch.targetCustomers !== undefined) mergedBusinessInfo.targetCustomers = patch.targetCustomers;
  if (patch.services !== undefined) mergedBusinessInfo.services = patch.services;
  if (patch.location !== undefined) mergedBusinessInfo.location = patch.location;
  if (patch.contactPhone !== undefined) mergedBusinessInfo.contactPhone = patch.contactPhone;
  if (patch.contactEmail !== undefined) mergedBusinessInfo.contactEmail = patch.contactEmail;
  if (patch.usps !== undefined) mergedBusinessInfo.usps = patch.usps;
  if (patch.notes !== undefined) mergedBusinessInfo.notes = patch.notes;

  let nextStep: WizardStep = site.currentStep;

  if (patch.advance === true) {
    const nameOk = mergedBusinessInfo.name.trim().length > 0;
    const categoryOk =
      mergedBusinessInfo.category !== undefined &&
      mergedBusinessInfo.category !== null &&
      (mergedBusinessInfo.category as unknown) !== "";
    if (!nameOk || !categoryOk) {
      return { ok: false, error: "missing_required_fields" };
    }
    nextStep = "templates";
  }

  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, {
    businessInfo: mergedBusinessInfo,
    currentStep: nextStep,
    hasUnpublishedChanges,
  });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}