"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { SiteRenderer } from "@/shared/site-render/SiteRenderer";
import { dirFor } from "@/shared/i18n/config";
import { buildTemplateDemo } from "@/features/templates/lib/demoContent";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";
import type { TemplateDefinition } from "@/features/templates/types";
import type { Locale } from "@/features/sites/types";

const PREVIEW_MESSAGES = { en: enMessages, ar: arMessages } as const;

export function TemplatePreviewShell({
  template,
  activePageId,
}: {
  template: TemplateDefinition;
  activePageId: string;
}) {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={PREVIEW_MESSAGES[locale]}>
      <PreviewSite template={template} activePageId={activePageId} locale={locale} setLocale={setLocale} />
    </NextIntlClientProvider>
  );
}

function PreviewSite({
  template,
  activePageId,
  locale,
  setLocale,
}: {
  template: TemplateDefinition;
  activePageId: string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const t = useTranslations();

  const demo = useMemo(() => buildTemplateDemo(template, locale), [template, locale]);

  return (
    <div lang={locale} dir={dirFor(locale)} className="min-h-screen bg-white">
      <div className="border-b-[1.5px] border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="rounded-full border-[1.5px] border-mono-red px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-mono-red">
            {t("preview.demo_badge")}
          </span>
          <span className="mono-display text-sm font-semibold text-ink">
            {template.name[locale]}
          </span>
          <div className="flex-1" />
          <div className="flex overflow-hidden rounded-[4px] border-[1.5px] border-ink">
            {(["en", "ar"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                aria-pressed={locale === lang}
                className={`px-2.5 py-1 font-mono text-xs font-semibold uppercase ${
                  locale === lang ? "bg-ink text-paper" : "bg-paper text-ink-3 hover:text-ink"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <Link
            href="/en/dashboard/templates"
            className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink underline underline-offset-4 hover:text-mono-red"
          >
            {t("preview.back")}
          </Link>
        </div>
      </div>
      <SiteRenderer
        template={template}
        locale={locale}
        pageId={activePageId}
        content={demo.content}
        businessInfo={demo.businessInfo}
        images={{}}
        brandColor={template.colors.defaultAccent}
        editMode={false}
        pageBaseHref={`/preview/${template.id}`}
      />
    </div>
  );
}