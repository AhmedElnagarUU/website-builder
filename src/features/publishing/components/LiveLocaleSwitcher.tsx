import Link from "next/link";
import type { Locale } from "@/features/sites/types";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ar: "العربية",
};

interface LiveLocaleSwitcherProps {
  activeLanguages: Locale[];
  currentLang: string;
  slug: string;
}

export function LiveLocaleSwitcher({
  activeLanguages,
  currentLang,
  slug,
}: LiveLocaleSwitcherProps) {
  if (activeLanguages.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Language"
      className="flex items-center bg-paper-2/60 px-4 py-2"
    >
      {activeLanguages.map((lang) => {
        const active = lang === currentLang;
        const className = `rounded px-3 py-1 text-sm font-medium transition-colors ${
          active
            ? "cursor-default bg-ink text-paper"
            : "text-ink-2 hover:bg-muted hover:text-ink"
        }`;
        return active ? (
          <span key={lang} aria-current="page" className={className}>
            {LOCALE_LABELS[lang]}
          </span>
        ) : (
          <Link key={lang} href={`/live/${slug}/${lang}`} className={className}>
            {LOCALE_LABELS[lang]}
          </Link>
        );
      })}
    </nav>
  );
}
