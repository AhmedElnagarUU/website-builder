import { z } from "zod";
import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import type { Locale, SiteDTO } from "@/features/sites/types";

export const languageChoiceSchema = z.object({
  languageChoice: z.enum(["en", "ar", "both"]),
  advance: z.boolean().optional(),
});

export type LanguageChoice = z.infer<typeof languageChoiceSchema>["languageChoice"];

function toLocales(choice: LanguageChoice): Locale[] {
  switch (choice) {
    case "en":
      return ["en"];
    case "ar":
      return ["ar"];
    case "both":
      return ["en", "ar"];
  }
}

export type UpdateLanguagesResult =
  | { ok: true; site: SiteDTO }
  | {
      ok: false;
      error:
        | "unauthorized"
        | "not_found"
        | "invalid_choice"
        | "content_exists";
    };

export async function updateLanguages(
  siteId: string,
  rawBody: unknown
): Promise<UpdateLanguagesResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = languageChoiceSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, error: "invalid_choice" };
  }
  const { languageChoice, advance } = parsed.data;

  // Check if any locale has content
  const hasContent = Object.values(site.content).some(
    (localeContent) => localeContent && Object.keys(localeContent).length > 0
  );
  if (hasContent) {
    return { ok: false, error: "content_exists" };
  }

  const locales = toLocales(languageChoice);
  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, {
    languagesRequested: locales,
    activeLanguages: locales,
    currentStep: advance === true ? "generating" : site.currentStep,
    hasUnpublishedChanges,
  });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}