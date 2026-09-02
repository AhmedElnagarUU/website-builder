import type { Site, Locale } from "@/features/sites/types";
import { countEditedFieldsInContent } from "@/features/sites/lib/content";

export function countEditedFields(site: Pick<Site, "activeLanguages" | "content">): number {
  return countEditedFieldsInContent(site.content);
}

export type RegenerateImpactResult =
  | { ok: true; data: { userEditedCount: number; locales: Locale[] } }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getRegenerateImpact(
  siteId: string
): Promise<RegenerateImpactResult> {
  const { getSession } = await import("@/features/auth/lib/session");
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const { getSiteForOwner } = await import("@/features/sites/repository");
  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  return {
    ok: true,
    data: {
      userEditedCount: countEditedFields(site),
      locales: site.activeLanguages as Locale[],
    },
  };
}
