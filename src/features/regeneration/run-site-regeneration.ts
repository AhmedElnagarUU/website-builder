import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { getAiConfig, classifyError } from "@/features/generation/run-generation";
import { generateFields } from "@/features/generation/lib/ai-client";
import { buildGenerationMessages } from "@/features/generation/lib/prompt-builder";
import { validateAndSanitize } from "@/features/generation/lib/field-validation";
import { mergeGeneratedContent } from "@/features/generation/lib/merge-content";
import type { Locale, SiteDTO } from "@/features/sites/types";

export async function runSiteRegeneration(siteId: string): Promise<void> {
  const aiConfig = getAiConfig();
  const { getSiteById } = await import("@/features/sites/repository");
  const site = await getSiteById(siteId);
  if (!site) return;

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return;

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
            const retryMessages = { system: messages.system, user: retryUser };
            const retryResult = await generateFields(retryMessages, aiConfig);
            return retryResult[field.key] ?? "";
          } catch (e) {
            console.error("site regeneration retry failed", e);
            return "";
          }
        },
      });

      newContent[locale] = mergeGeneratedContent(results, site.businessInfo);
      await updateSite(siteId, { content: newContent });
    } catch (e) {
      console.error(`Site regeneration failed for locale ${locale}:`, e);
      lastError = classifyError(e);
      break;
    }
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
