import { updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { getAiConfig, classifyError } from "@/features/generation/run-generation";
import { generateFields } from "@/features/generation/lib/ai-client";
import { buildGenerationMessages } from "@/features/generation/lib/prompt-builder";
import { validateAndSanitize } from "@/features/generation/lib/field-validation";
import { mergeGeneratedContent } from "@/features/generation/lib/merge-content";
import type { Locale, Site, SiteDTO, ContentField } from "@/features/sites/types";
import type { TemplateDefinition } from "@/features/templates/types";

function missingRequiredKeys(
  currentTemplate: TemplateDefinition | null,
  newTemplate: TemplateDefinition
): string[] {
  const currentKeys = new Set(
    currentTemplate
      ? currentTemplate.sections.flatMap((s) => s.fields.map((f) => f.key))
      : []
  );
  const missing: string[] = [];
  for (const section of newTemplate.sections) {
    for (const field of section.fields) {
      if (field.required && !currentKeys.has(field.key)) missing.push(field.key);
    }
  }
  return missing;
}

export async function runTemplateBackfill(siteId: string, newTemplateId: string): Promise<void> {
  const aiConfig = getAiConfig();
  const { getSiteById } = await import("@/features/sites/repository");
  const site = await getSiteById(siteId);
  if (!site) return;

  const newTemplate = getTemplate(newTemplateId);
  const currentTemplate = site.templateId ? getTemplate(site.templateId) : null;
  if (!newTemplate) return;

  const missing = missingRequiredKeys(currentTemplate, newTemplate);
  const missingSet = new Set(missing);
  if (missing.length === 0) {
    const brandColor =
      site.brandColor === "" ? newTemplate.colors.defaultAccent : site.brandColor;
    const hasUnpublishedChanges =
      site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;
    await updateSite(siteId, {
      templateId: newTemplateId,
      brandColor,
      hasUnpublishedChanges,
      currentStep: "editing",
      generation: { status: "complete", startedAt: new Date(), finishedAt: new Date() },
    });
    return;
  }

  const subsetSections = newTemplate.sections.filter((s) =>
    s.fields.some((f) => missingSet.has(f.key))
  );
  const subsetTemplate: TemplateDefinition = { ...newTemplate, sections: subsetSections };

  const locales = site.activeLanguages as Locale[];
  const newContent: SiteDTO["content"] = { ...(site.content as SiteDTO["content"]) };
  let lastError: string | null = null;

  for (const locale of locales) {
    try {
      const existingLocale = (site.content[locale] ?? {}) as Record<string, ContentField>;
      const otherSectionValues: Record<string, string> = {};
      for (const [key, field] of Object.entries(existingLocale)) {
        otherSectionValues[key] = field.value;
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
            console.error("template backfill retry failed", e);
            return "";
          }
        },
      });

      const regenerated = mergeGeneratedContent(results, site.businessInfo);
      const nextLocale = { ...existingLocale };
      for (const key of missingSet) {
        const genField = regenerated[key];
        if (genField) nextLocale[key] = genField;
      }
      newContent[locale] = nextLocale;
      await updateSite(siteId, { content: newContent });
    } catch (e) {
      console.error(`Template backfill failed for locale ${locale}:`, e);
      lastError = classifyError(e);
      break;
    }
  }

  if (lastError) {
    await updateSite(siteId, {
      generation: { status: "failed", error: lastError, startedAt: new Date(), finishedAt: new Date() },
    });
    return;
  }

  const brandColor = site.brandColor === "" ? newTemplate.colors.defaultAccent : site.brandColor;
  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;
  await updateSite(siteId, {
    templateId: newTemplateId,
    content: newContent,
    brandColor,
    hasUnpublishedChanges,
    currentStep: "editing",
    generation: { status: "complete", startedAt: new Date(), finishedAt: new Date() },
  });
}

export function hasSiteContent(site: Pick<Site, "activeLanguages" | "content">): boolean {
  for (const locale of site.activeLanguages as Locale[]) {
    const lc = site.content[locale] ?? {};
    if (Object.keys(lc).length > 0) return true;
  }
  return false;
}
