import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getPublishedSiteBySlug } from "@/features/publishing/get-published-site";
import { getTemplate } from "@/features/templates/api/list-templates";
import { SiteRenderer } from "@/shared/site-render/SiteRenderer";
import { dirFor } from "@/shared/i18n/config";
import { nextUrl } from "@/features/publishing/live-url";
import { LiveLocaleSwitcher } from "@/features/publishing/components/LiveLocaleSwitcher";

interface LivePageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({
  params,
}: LivePageProps): Promise<Metadata> {
  const { slug, lang } = await params;

  if (lang !== "en" && lang !== "ar") {
    return {};
  }

  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) {
    return {};
  }
  if (!result.snapshot.activeLanguages.includes(lang)) {
    return {};
  }

  const content = result.snapshot.content[lang] ?? {};
  const title =
    content["nav_home"]?.value ||
    content["hero_headline"]?.value ||
    content["hero_title"]?.value ||
    "";
  const description =
    content["hero_subtitle"]?.value ||
    content["about_body"]?.value ||
    content["about_text"]?.value ||
    "";
  const canonical = nextUrl(slug);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

export default async function LiveSitePage({ params }: LivePageProps) {
  const { slug, lang } = await params;

  if (lang !== "en" && lang !== "ar") {
    notFound();
  }

  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) {
    notFound();
  }
  if (!result.snapshot.activeLanguages.includes(lang)) {
    notFound();
  }

  const template = getTemplate(result.snapshot.templateId);
  if (!template) {
    notFound();
  }

  const snapshot = result.snapshot;
  const content = snapshot.content[lang] ?? {};
  const messages = (await import(`@/messages/${lang}.json`)).default;

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <div dir={dirFor(lang)} lang={lang} className="min-h-screen">
        <LiveLocaleSwitcher
          activeLanguages={snapshot.activeLanguages}
          currentLang={lang}
          slug={slug}
        />
        <SiteRenderer
          template={template}
          locale={lang}
          content={content}
          businessInfo={result.businessInfo}
          images={snapshot.images}
          brandColor={snapshot.brandColor}
          editMode={false}
          s3PublicBaseUrl={process.env.S3_PUBLIC_BASE_URL}
        />
      </div>
    </NextIntlClientProvider>
  );
}
