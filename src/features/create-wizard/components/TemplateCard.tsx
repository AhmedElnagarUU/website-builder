"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { TemplateDefinition } from "@/features/templates/types";
import type { Locale } from "@/features/sites/types";

export function TemplateCard({
  template,
  locale,
  selected,
  onSelect,
}: {
  template: TemplateDefinition;
  locale: Locale;
  selected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations();
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col gap-2 rounded-[4px] border-[1.5px] border-ink bg-card p-3 text-start shadow-vexa transition-all hover:-translate-y-0.5 ${
        selected ? "border-vexa-red ring-2 ring-vexa-red" : ""
      }`}
    >
      {imageError ? (
        <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[4px] bg-paper-2 p-4">
          <p className="vexa-display text-center text-xl font-semibold text-ink">
            {template.name[locale]}
          </p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/templates/${template.id}/preview.svg`}
          alt={template.name[locale]}
          className="aspect-[4/5] w-full rounded-[4px] object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="vexa-display text-lg font-semibold text-ink">{template.name[locale]}</p>
          <p className="font-serif2 text-xs text-ink-2">{template.description[locale]}</p>
        </div>
        {selected && (
          <span
            aria-label={t("wizard.templates.selected_check")}
            className="rounded-full bg-vexa-red px-2 py-0.5 text-xs font-semibold text-paper"
          >
            ✓
          </span>
        )}
      </div>
    </button>
  );
}