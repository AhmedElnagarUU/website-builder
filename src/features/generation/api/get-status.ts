import { getSiteForOwner } from "@/features/sites/repository";
import type { ContentField, Locale, SiteDTO } from "@/features/sites/types";

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

function countFieldsInLocale(content: Record<string, ContentField> | undefined): number {
  if (!content) return 0;
  return Object.keys(content).length;
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
  for (const locale of site.activeLanguages as Locale[]) {
    const localeContent = (site.content as SiteDTO["content"])[locale];
    if (countFieldsInLocale(localeContent) > 0) localesDone++;
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