"use client";

import { useTranslations } from "next-intl";
import type { Locale } from "@/features/sites/types";

const TAB_ORDER: Locale[] = ["en", "ar"];

export function LanguageTabs({
  activeLanguages,
  active,
  onChange,
}: {
  activeLanguages: Locale[];
  active: Locale;
  onChange: (locale: Locale) => void;
}) {
  const t = useTranslations();
  const visible = TAB_ORDER.filter((l) => activeLanguages.includes(l));
  if (visible.length <= 1) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-paper p-1">
      {visible.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          aria-pressed={active === lang}
          className={`mono-display rounded-full px-3 py-1 text-lg leading-none transition-colors ${
            active === lang
              ? "bg-mono-red text-paper"
              : "text-ink hover:bg-paper-2"
          }`}
        >
          {t(`editor.tab.editing_${lang}`)}
        </button>
      ))}
    </div>
  );
}
