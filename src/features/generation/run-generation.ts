import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { generateFields } from "./lib/ai-client";
import { buildGenerationMessages } from "./lib/prompt-builder";
import { validateAndSanitize } from "./lib/field-validation";
import { mergeGeneratedContent, mergePageContent } from "./lib/merge-content";
import { pageContentOf, setPageContent } from "@/features/sites/lib/content";
import type { ContentField, Locale, Site } from "@/features/sites/types";
import type { TemplatePage } from "@/features/templates/types";

export function getAiConfig() {
  const geminiKey = process.env.GEMINI_KEY;
  if (geminiKey) {
    const model = "gemini-3.6-flash";
    const baseUrl =
      process.env.AI_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
    return { baseUrl, apiKey: geminiKey, model, useStructuredOutput: true };
  }

  const baseUrl = process.env.AI_API_BASE_URL;
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl) throw new Error("AI_API_BASE_URL is not defined");
  if (!apiKey) throw new Error("AI_API_KEY (or OPENROUTER_API_KEY) is not defined");
  if (!model) throw new Error("AI_MODEL is not defined");

  const extraHeaders: Record<string, string> = {};
  const referer = process.env.NEXT_PUBLIC_APP_URL;
  if (referer) extraHeaders["HTTP-Referer"] = referer;
  const appName = process.env.AI_APP_NAME || "Monomastic";
  extraHeaders["X-Title"] = appName;

  return { baseUrl, apiKey, model, extraHeaders, useStructuredOutput: true };
}

export function classifyError(e: unknown): "timeout" | "provider_error" | "bad_response" {
  const name = (e as Error)?.name;
  if (name === "TimeoutError") return "timeout";
  if (name === "BadResponseError") return "bad_response";
  return "provider_error";
}

export interface AiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  extraHeaders?: Record<string, string>;
  useStructuredOutput?: boolean;
}

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
