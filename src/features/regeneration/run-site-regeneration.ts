import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { getAiConfig, generatePage } from "@/features/generation/run-generation";
import { pageContentOf, setPageContent } from "@/features/sites/lib/content";
import { mergePageContent } from "@/features/generation/lib/merge-content";
import type { Locale } from "@/features/sites/types";

export async function runSiteRegeneration(siteId: string, pageIds?: string[]): Promise<void> {
  const aiConfig = getAiConfig();
  const { getSiteById } = await import("@/features/sites/repository");
  const site = await getSiteById(siteId);
  if (!site) return;

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return;

  const locales = site.activeLanguages as Locale[];
  const pages = pageIds
    ? template.pages.filter((p) => pageIds.includes(p.id))
    : template.pages;

  let newContent = { ...site.content };
  let lastError: string | null = null;

  for (const page of pages) {
    for (const locale of locales) {
      const otherValues: Record<string, string> = {};
      for (const p of template.pages) {
        if (p.id === page.id) continue;
        for (const s of p.sections) {
          for (const f of s.fields) {
            otherValues[f.key] = pageContentOf(newContent, p.id)[locale]?.[f.key]?.value ?? "";
          }
        }
      }

      const result = await generatePage(site, page, locale, aiConfig, otherValues);
      if (result.error) {
        lastError = result.error;
        break;
      }
      const existingPage = pageContentOf(newContent, page.id);
      newContent = setPageContent(newContent, page.id, {
        ...existingPage,
        [locale]: mergePageContent(existingPage[locale] ?? {}, result.content),
      });
      await updateSite(siteId, { content: newContent });
    }
    if (lastError) break;
  }

  if (lastError) {
    await updateSite(siteId, {
      content: newContent,
      generation: {
        status: "failed",
        error: lastError,
        startedAt: new Date(),
        finishedAt: new Date(),
      },
    });
    return;
  }

  const brandColor = site.brandColor === "" ? template.colors.defaultAccent : site.brandColor;
  await updateSite(siteId, {
    content: newContent,
    brandColor,
    hasUnpublishedChanges: true,
    generation: {
      status: "complete",
      startedAt: new Date(),
      finishedAt: new Date(),
    },
  });
}
