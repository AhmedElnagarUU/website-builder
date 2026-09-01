import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { generateFields } from "./lib/ai-client";
import { buildGenerationMessages } from "./lib/prompt-builder";
import { validateAndSanitize } from "./lib/field-validation";
import { mergeGeneratedContent } from "./lib/merge-content";
import type { ContentField, Locale, SiteDTO } from "@/features/sites/types";

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
  const appName = process.env.AI_APP_NAME || "SiteCraft";
  extraHeaders["X-Title"] = appName;

  return { baseUrl, apiKey, model, extraHeaders, useStructuredOutput: true };
}

export function classifyError(e: unknown): "timeout" | "provider_error" | "bad_response" {
  const name = (e as Error)?.name;
  if (name === "TimeoutError") return "timeout";
  if (name === "BadResponseError") return "bad_response";
  return "provider_error";
}

export async function runGeneration(siteId: string): Promise<void> {
  const start = Date.now();
  const aiConfig = getAiConfig();

  // Get the current site state via the repository
  // We need to import here to avoid circular deps
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
  const newContent: SiteDTO["content"] = { ...(site.content as SiteDTO["content"]) };

  let lastError: string | null = null;

  for (const locale of locales) {
    try {
      const messages = buildGenerationMessages({
        businessInfo: site.businessInfo,
        template,
        locale,
      });
      const fields = await generateFields(messages, aiConfig);

      const results = await validateAndSanitize(fields, template, {
        businessName: site.businessInfo.name || "Your Business",
        locale,
        aiConfig,
        retry: async (field, _retryLocale, _businessName) => {
          const limitText =
            field.constraint.maxWords !== undefined
              ? `maximum ${field.constraint.maxWords} words`
              : `maximum ${field.constraint.maxChars ?? "any"} characters`;
          const retryUser = `Rewrite ONLY field "${field.key}" with ${limitText}. Return the same JSON shape: {"fields":{"${field.key}":"<text>"}}.`;
          try {
            const retryMessages = {
              system: messages.system,
              user: retryUser,
            };
            const retryResult = await generateFields(retryMessages, aiConfig);
            return retryResult[field.key] ?? "";
          } catch (e) {
            console.error("retry failed", e);
            return "";
          }
        },
      });

      const merged: Record<string, ContentField> = mergeGeneratedContent(results, site.businessInfo);
      newContent[locale] = merged;

      // Persist partial progress after each locale
      await updateSite(siteId, {
        content: newContent,
      });
    } catch (e) {
      console.error(`Generation failed for locale ${locale}:`, e);
      lastError = classifyError(e);
      break;
    }
  }

  if (lastError) {
    // Mark failed but keep partial content
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

  // Success side-effects
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