import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTemplate } from "@/features/templates/api/list-templates";
import { SiteRenderer } from "@/shared/site-render/SiteRenderer";
import { dirFor } from "@/shared/i18n/config";
import { nextUrl, livePageBaseUrl } from "../live-url";
import { getTemplatePages } from "../page-shape";
import { LiveLocaleSwitcher } from "./LiveLocaleSwitcher";
import type { PublishedSnapshot, SiteBusinessInfo, Locale } from "@/features/sites/types";

export async function livePageMetadata({
  slug,
  lang,
  snapshot,
  pageId,
}: {
  slug: string;
  lang: Locale;
  snapshot: PublishedSnapshot;
  pageId: string;
}): Promise<Metadata> {
  const template = getTemplate(snapshot.templateId);
  if (!template) return {};
  const page = template.pages.find((p) => p.id === pageId);
  if (!page) return {};

  const content = snapshot.content[pageId]?.[lang] ?? {};
  const title =
    content["hero_headline"]?.value ||
    content["about_title"]?.value ||
    `${page.name[lang]}`;

  const headField =
    page.sections.find((s) => s.type === "hero" || s.type === "about" || s.type === "services")
      ?.fields[0]?.key ?? "";
  const description = headField ? content[headField]?.value || "" : "";

  const canonical = nextUrl(slug, page.slug || undefined);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export async function LiveSitePage({
  slug,
  lang,
  snapshot,
  businessInfo,
  pageId,
}: {
  slug: string;
  lang: Locale;
  snapshot: PublishedSnapshot;
  businessInfo: SiteBusinessInfo;
  pageId: string;
}) {
  const template = getTemplate(snapshot.templateId);
  if (!template) return null;

  const page = template.pages.find((p) => p.id === pageId);
  const messages = (await import(`@/messages/${lang}.json`)).default;
  const baseUrl = livePageBaseUrl(slug, lang);

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <div dir={dirFor(lang)} lang={lang} className="min-h-screen">
        <LiveLocaleSwitcher
          activeLanguages={snapshot.activeLanguages}
          currentLang={lang}
          slug={slug}
          pageSlug={page?.slug}
        />
        <SiteRenderer
          template={template}
          locale={lang}
          pageId={pageId}
          content={snapshot.content}
          businessInfo={businessInfo}
          images={snapshot.images}
          brandColor={snapshot.brandColor}
          editMode={false}
          s3PublicBaseUrl={process.env.S3_PUBLIC_BASE_URL}
          pageBaseHref={baseUrl}
        />
      </div>
    </NextIntlClientProvider>
  );
}

export function snapshotHasPage(snapshot: PublishedSnapshot, pageId: string): boolean {
  return getTemplatePages(snapshot.templateId).some((p) => p.id === pageId);
}
