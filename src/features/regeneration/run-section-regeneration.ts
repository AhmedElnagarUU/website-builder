import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { findSectionInTemplate } from "@/features/templates/pages";
import { getAiConfig, generatePage } from "@/features/generation/run-generation";
import { pageContentOf, setPageContent } from "@/features/sites/lib/content";
import { mergePageContent } from "@/features/generation/lib/merge-content";
import type { Locale } from "@/features/sites/types";
import type { TemplatePage } from "@/features/templates/types";

export async function runSectionRegeneration(
  siteId: string,
  sectionId: string
): Promise<void> {
  const aiConfig = getAiConfig();
  const { getSiteById } = await import("@/features/sites/repository");
  const site = await getSiteById(siteId);
  if (!site) return;

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return;

  let page: TemplatePage | undefined;
  for (const p of template.pages) {
    if (p.sections.some((s) => s.id === sectionId)) {
      page = p;
      break;
    }
  }
  if (!page) return;
  const section = findSectionInTemplate(template, sectionId);
  if (!section) return;
  const sectionPage: TemplatePage = { ...page, sections: [section] };

  const locales = site.activeLanguages as Locale[];
  let newContent = { ...site.content };
  let lastError: string | null = null;

  for (const locale of locales) {
    const otherValues: Record<string, string> = {};
    for (const p of template.pages) {
      for (const s of p.sections) {
        if (s.id === sectionId) continue;
        for (const f of s.fields) {
          otherValues[f.key] = pageContentOf(newContent, p.id)[locale]?.[f.key]?.value ?? "";
        }
      }
    }

    const result = await generatePage(site, sectionPage, locale, aiConfig, otherValues);
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

  await updateSite(siteId, {
    content: newContent,
    hasUnpublishedChanges: true,
    generation: {
      status: "complete",
      startedAt: new Date(),
      finishedAt: new Date(),
    },
  });
}
