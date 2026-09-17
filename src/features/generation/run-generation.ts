import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { generateFields } from "./lib/ai-client";
import { buildGenerationMessages } from "./lib/prompt-builder";
import { validateAndSanitize } from "./lib/field-validation";
import { mergeGeneratedContent, mergePageContent } from "./lib/merge-content";
import { pageContentOf, setPageContent } from "@/features/sites/lib/content";
import { getAiConfig, classifyError } from "./lib/ai-config";
import type { AiConfig } from "./lib/ai-config";
import type { ContentField, Locale, Site } from "@/features/sites/types";

export { getAiConfig, classifyError };
export type { AiConfig };
import type { TemplatePage } from "@/features/templates/types";

export async function generatePage(
  site: Pick<Site, "businessInfo">,
  page: TemplatePage,
  locale: Locale,
  aiConfig: AiConfig,
  otherValues?: Record<string, string>
): Promise<{ content: Record<string, ContentField>; error: string | null }> {
  try {
    const messages = buildGenerationMessages({
      businessInfo: site.businessInfo,
      sections: page.sections,
      locale,
      otherSectionValues: otherValues,
    });

    const fields = await generateFields(messages, aiConfig);

    const results = await validateAndSanitize(fields, page.sections, {
      businessName: site.businessInfo.name || "Your Business",
      locale,
      aiConfig,
      retry: async (field) => {
        const limitText =
          field.constraint.maxWords !== undefined
            ? `maximum ${field.constraint.maxWords} words`
            : `maximum ${field.constraint.maxChars ?? "any"} characters`;
        const retryUser = `Rewrite ONLY field "${field.key}" with ${limitText}. Return the same JSON shape: {"fields":{"${field.key}":"<text>"}}.`;
        try {
          const retryMessages = { system: messages.system, user: retryUser };
          const retryResult = await generateFields(retryMessages, aiConfig);
          return retryResult[field.key] ?? "";
        } catch (e) {
          console.error("retry failed", e);
          return "";
        }
      },
    });

    return { content: mergeGeneratedContent(results, site.businessInfo), error: null };
  } catch (e) {
    console.error(`Generation failed for page ${page.id} locale ${locale}:`, e);
    return { content: {}, error: classifyError(e) };
  }
}

export async function runGeneration(siteId: string, pageIds?: string[]): Promise<void> {
  const start = Date.now();
  const aiConfig = getAiConfig();

  const { getSiteById } = await import("@/features/sites/repository");

  const site = await getSiteById(siteId);
  if (!site) {
    console.error(`runGeneration: site ${siteId} not found`);
    return;
  }
  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) {
    await updateSite(siteId, {
      generation: { status: "failed", error: "no_template", startedAt: new Date(), finishedAt: new Date() },
    });
    return;
  }

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
  const hasUnpublishedChanges = site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  await updateSite(siteId, {
    content: newContent,
    brandColor,
    currentStep: "editing",
    hasUnpublishedChanges,
    generation: {
      status: "complete",
      startedAt: new Date(),
      finishedAt: new Date(),
    },
  });

  const duration = Date.now() - start;
  console.log(`runGeneration: site ${siteId} completed in ${duration}ms`);
}
