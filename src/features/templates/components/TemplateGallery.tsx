"use client";

import { useTranslations } from "next-intl";
import { TEMPLATES } from "../catalog";
import { TemplatePreviewLink } from "./TemplatePreviewLink";
import { TemplateThumbnail } from "./TemplateThumbnail";
import type { TemplateDefinition } from "../types";
import type { CategoryId, Locale } from "@/features/sites/types";

export function TemplateGallery({
  locale,
  highlightedCategory,
}: {
  locale: Locale;
  highlightedCategory?: CategoryId;
}) {
  const ordered = [...TEMPLATES].sort((a, b) => {
    const rankA = highlightedCategory && a.categories.includes(highlightedCategory) ? 0 : 1;
    const rankB = highlightedCategory && b.categories.includes(highlightedCategory) ? 0 : 1;
    if (rankA !== rankB) return rankA - rankB;
    return a.name.en.localeCompare(b.name.en);
  });

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((template) => (
        <TemplateGalleryCard key={template.id} template={template} locale={locale} />
      ))}
    </div>
  );
}

function TemplateGalleryCard({
  template,
  locale,
}: {
  template: TemplateDefinition;
  locale: Locale;
}) {
  const t = useTranslations();
  const category = template.categories[0];
  const categoryLabel = t(`dashboard.gallery.category.${category}`);
  const styleLabel = t(`dashboard.gallery.font.${template.style.fontPair}`);

  return (
    <div className="flex flex-col rounded-[4px] border-[1.5px] border-ink bg-card p-3 shadow-mono transition-transform hover:-translate-y-0.5">
      <TemplateThumbnail
        templateId={template.id}
        name={template.name[locale]}
        accent={template.colors.defaultAccent}
        screenshot={template.screenshot}
        className="aspect-[4/5]"
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex-1">
          <h3 className="mono-display text-lg font-semibold text-ink">
            {template.name[locale]}
          </h3>
          <p className="font-serif2 mt-0.5 text-xs leading-snug text-ink-2">
            {template.description[locale]}
          </p>
        </div>
        <span
          className="inline-block h-6 w-6 shrink-0 rounded-[4px] border-[1.5px] border-ink"
          style={{ backgroundColor: template.colors.defaultAccent }}
          aria-label={template.colors.defaultAccent}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-[1.5px] border-dashed border-ink/25 pt-3">
        <span className="rounded-full border border-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
          {categoryLabel}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-3">
          {t("dashboard.gallery.style")}: {styleLabel}
        </span>
        <span className="shrink-0">
          <TemplatePreviewLink template={template} />
        </span>
      </div>
    </div>
  );
}
