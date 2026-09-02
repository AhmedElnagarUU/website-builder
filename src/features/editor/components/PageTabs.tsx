"use client";

import { useTranslations } from "next-intl";
import type { TemplateDefinition } from "@/features/templates/types";
import type { Locale } from "@/features/sites/types";

export function PageTabs({
  template,
  activePageId,
  onChange,
  appLocale,
}: {
  template: TemplateDefinition;
  activePageId: string;
  onChange: (pageId: string) => void;
  appLocale: Locale;
}) {
  const t = useTranslations();
  const pages = template.pages.filter((p) => p.nav !== false || p.id === "home");
  if (pages.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="vexa-display text-sm font-semibold text-ink/70">{t("editor.tab.pages")}</span>
      <div className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-paper p-1">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => onChange(page.id)}
            aria-pressed={activePageId === page.id}
            className={`vexa-display rounded-full px-3 py-1 text-sm leading-none transition-colors ${
              activePageId === page.id
                ? "bg-vexa-red text-paper"
                : "text-ink hover:bg-paper-2"
            }`}
          >
            {page.name[appLocale]}
          </button>
        ))}
      </div>
    </div>
  );
}
