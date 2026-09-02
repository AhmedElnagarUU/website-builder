import { getSiteForOwner } from "@/features/sites/repository";
import type { Locale, SiteDTO } from "@/features/sites/types";

export type GenerationStatusResult =
  | {
      ok: true;
      data: {
        status: "idle" | "queued" | "running" | "complete" | "failed";
        error?: string;
        localesDone: number;
        localesTotal: number;
      };
    }
  | { ok: false; error: "unauthorized" | "not_found" };

function hasFieldsForLocale(content: SiteDTO["content"], locale: Locale): boolean {
  for (const page of Object.values(content)) {
    if (Object.keys(page[locale] ?? {}).length > 0) return true;
  }
  return false;
}

export async function getGenerationStatus(
  siteId: string
): Promise<GenerationStatusResult> {
  const { getSession } = await import("@/features/auth/lib/session");
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const localesTotal = site.activeLanguages.length;
  let localesDone = 0;
  const content = site.content as SiteDTO["content"];
  for (const locale of site.activeLanguages as Locale[]) {
    if (hasFieldsForLocale(content, locale)) localesDone++;
  }

  return {
    ok: true,
    data: {
      status: site.generation.status,
      error: site.generation.error,
      localesDone,
      localesTotal,
    },
  };
}