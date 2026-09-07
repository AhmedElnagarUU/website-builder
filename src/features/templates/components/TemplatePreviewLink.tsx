"use client";

import { useTranslations } from "next-intl";
import type { TemplateDefinition } from "../types";

export function TemplatePreviewLink({ template }: { template: TemplateDefinition }) {
  const t = useTranslations();

  return (
    <a
      href={`/preview/${template.id}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("preview.open_new_tab")}
      className="inline-flex items-center justify-center gap-1.5 rounded-[4px] border-[1.5px] border-ink bg-paper px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      {t("preview.view")}
    </a>
  );
}