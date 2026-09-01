import type { Locale, Site } from "@/features/sites/types";

export function countEditedFields(site: Pick<Site, "activeLanguages" | "content">): number {
  let count = 0;
  for (const locale of site.activeLanguages as Locale[]) {
    const localeContent = site.content[locale] ?? {};
    for (const field of Object.values(localeContent)) {
      if (field.edited) count++;
    }
  }
  return count;
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
