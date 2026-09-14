"use client";

import { dirFor } from "@/shared/i18n/config";

/**
 * Inline script that sets the lang and dir attributes on <html> early
 * during page load (before React hydration), preventing language
 * flashes and ensuring correct directionality for RTL content.
 *
 * Must be rendered inside the [locale] layout after setRequestLocale.
 */
export function HtmlLangDirScript({ locale }: { locale: string }) {
  const direction = dirFor(locale);
  return (
    <script
      id="html-lang-dir"
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${direction}";`,
      }}
    />
  );
}
