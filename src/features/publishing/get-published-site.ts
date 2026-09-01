import { getSiteBySlug } from "@/features/sites/repository";
import type {
  PublishedSnapshot,
  SiteBusinessInfo,
} from "@/features/sites/types";

export type GetPublishedSiteResult =
  | {
      ok: true;
      snapshot: PublishedSnapshot;
      businessInfo: SiteBusinessInfo;
      siteId: string;
    }
  | { ok: false; error: "not_found" | "not_live" };

export async function getPublishedSiteBySlug(
  slug: string
): Promise<GetPublishedSiteResult> {
  const site = await getSiteBySlug(slug);
  if (!site) {
    return { ok: false, error: "not_found" };
  }
  if (site.publishedSnapshot === null || site.status !== "published") {
    return { ok: false, error: "not_live" };
  }
  return {
    ok: true,
    snapshot: site.publishedSnapshot,
    businessInfo: site.businessInfo,
    siteId: site._id.toString(),
  };
}
