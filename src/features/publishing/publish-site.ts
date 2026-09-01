import { MongoError } from "mongodb";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import type {
  ContentField,
  Locale,
  PublishedSnapshot,
  SiteDTO,
} from "@/features/sites/types";

export type PublishSiteResult =
  | { ok: true; site: SiteDTO; slug: string }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSuffix(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 6);
}

const MAX_SLUG_RETRIES = 3;

export async function publishSite(siteId: string): Promise<PublishSiteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  if (!site.templateId || !getTemplate(site.templateId)) {
    return { ok: false, error: "not_found" };
  }

  if (site.activeLanguages.length === 0) {
    return { ok: false, error: "validation_error" };
  }

  const content = {} as Record<Locale, Record<string, ContentField>>;
  for (const locale of site.activeLanguages) {
    content[locale] = (site.content[locale] ?? {}) as Record<string, ContentField>;
  }

  const snapshot: PublishedSnapshot = {
    templateId: site.templateId,
    activeLanguages: site.activeLanguages,
    content,
    images: site.images,
    brandColor: site.brandColor,
    publishedAt: new Date(),
  };

  const base = slugify(site.businessInfo.name) || "site";

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_SLUG_RETRIES; attempt++) {
    const slug = `${base}-${generateSuffix()}`;
    try {
      const updated = await updateSite(siteId, {
        publishedSnapshot: snapshot,
        status: "published",
        slug,
        hasUnpublishedChanges: false,
      });
      if (!updated) return { ok: false, error: "not_found" };
      return { ok: true, site: toSiteDTO(updated), slug };
    } catch (err) {
      if (err instanceof MongoError && err.code === 11000) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}
