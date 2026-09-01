import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { getAiConfig, classifyError } from "@/features/generation/run-generation";
import { generateFields } from "@/features/generation/lib/ai-client";
import { buildGenerationMessages } from "@/features/generation/lib/prompt-builder";
import { validateAndSanitize } from "@/features/generation/lib/field-validation";
import { mergeGeneratedContent } from "@/features/generation/lib/merge-content";
import type { ContentField, Locale, SiteDTO } from "@/features/sites/types";
import type { TemplateDefinition } from "@/features/templates/types";

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
  const section = template.sections.find((s) => s.id === sectionId);
  if (!section) return;

  const locales = site.activeLanguages as Locale[];
  const newContent: SiteDTO["content"] = { ...(site.content as SiteDTO["content"]) };
  let lastError: string | null = null;

  for (const locale of locales) {
    try {
      const existingLocale = (site.content[locale] ?? {}) as Record<string, ContentField>;
      const subsetTemplate: TemplateDefinition = { ...template, sections: [section] };

      const otherSectionValues: Record<string, string> = {};
      for (const s of template.sections) {
        if (s.id === sectionId) continue;
        for (const f of s.fields) {
          otherSectionValues[f.key] = existingLocale[f.key]?.value ?? "";
        }
      }

      const messages = buildGenerationMessages({
        businessInfo: site.businessInfo,
        template: subsetTemplate,
        locale,
        otherSectionValues,
      });

      const fields = await generateFields(messages, aiConfig);
      const results = await validateAndSanitize(fields, subsetTemplate, {
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
            console.error("section regeneration retry failed", e);
            return "";
          }
        },
      });

      const regenerated = mergeGeneratedContent(results, site.businessInfo);
      const nextLocale = { ...existingLocale };
      for (const [key, genField] of Object.entries(regenerated)) {
        const existing = existingLocale[key];
        if (existing?.edited) continue;
        nextLocale[key] = genField;
      }

      newContent[locale] = nextLocale;
      await updateSite(siteId, { content: newContent });
    } catch (e) {
      console.error(`Section regeneration failed for ${locale}:`, e);
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
