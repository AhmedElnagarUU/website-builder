"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { locales, type Locale } from "@/shared/i18n/config";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const otherLocale: Locale = currentLocale === "en" ? "ar" : "en";
  const otherLabel = otherLocale === "ar" ? "العربية" : "English";

  function onClick() {
    const segments = pathname.split("/");
    if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = otherLocale;
    } else {
      segments.splice(1, 0, otherLocale);
    }
    const newPath = segments.join("/") || `/${otherLocale}`;
    const query = searchParams.toString();
    const url = query ? `${newPath}?${query}` : newPath;
    router.replace(url);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("nav.language_switch_label")}
      className="vexa-display rounded-full border-2 border-ink px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      {otherLabel}
    </button>
  );
}