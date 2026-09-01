import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import { getTemplate } from "@/features/templates/api/list-templates";
import { contentPatchSchema } from "@/features/sites/schemas";
import type { ContentField, SiteDTO } from "@/features/sites/types";

export type UpdateContentResult =
  | { ok: true; site: SiteDTO }
  | {
      ok: false;
      error:
        | "unauthorized"
        | "not_found"
        | "validation_error"
        | "invalid_locale"
        | "unknown_field"
        | "field_too_long";
      field?: string;
    };

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function fieldConstraintFromTemplate(
  template: { sections: { fields: { key: string; constraint: { maxWords?: number; maxChars?: number } }[] }[] },
  key: string
): { maxWords?: number; maxChars?: number } | undefined {
  for (const section of template.sections) {
    for (const f of section.fields) {
      if (f.key === key) return f.constraint;
    }
  }
  return undefined;
}

function passesFieldConstraint(
  value: string,
  constraint: { maxWords?: number; maxChars?: number }
): boolean {
  const trimmed = value.trim();
  if (constraint.maxWords !== undefined && countWords(trimmed) > constraint.maxWords) {
    return false;
  }
  if (constraint.maxChars !== undefined && trimmed.length > constraint.maxChars) {
    return false;
  }
  return true;
}

export async function updateContent(
  siteId: string,
  rawBody: unknown
): Promise<UpdateContentResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = contentPatchSchema.safeParse(rawBody);
  if (!parsed.success) return { ok: false, error: "validation_error" };
  const { locale, updates } = parsed.data;

  if (!site.activeLanguages.includes(locale)) {
    return { ok: false, error: "invalid_locale" };
  }

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return { ok: false, error: "not_found" };

  for (const [key] of Object.entries(updates)) {
    const constraint = fieldConstraintFromTemplate(template, key);
    if (!constraint) return { ok: false, error: "unknown_field", field: key };
  }

  for (const [key, value] of Object.entries(updates)) {
    const constraint = fieldConstraintFromTemplate(template, key) as {
      maxWords?: number;
      maxChars?: number;
    };
    if (!passesFieldConstraint(value, constraint)) {
      return { ok: false, error: "field_too_long", field: key };
    }
  }

  const existingLocale = (site.content[locale] ?? {}) as Record<string, ContentField>;
  const nextLocale: Record<string, ContentField> = { ...existingLocale };
  for (const [key, value] of Object.entries(updates)) {
    nextLocale[key] = {
      value: value.trim(),
      origin: "user",
      edited: true,
      reviewFlagged: false,
    };
  }

  const content: SiteDTO["content"] = { ...site.content, [locale]: nextLocale };
  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, { content, hasUnpublishedChanges });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}
