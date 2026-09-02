import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedSiteBySlug } from "@/features/publishing/get-published-site";
import {
  LiveSitePage,
  livePageMetadata,
} from "@/features/publishing/components/LiveSitePage";
import { getTemplatePages } from "@/features/publishing/page-shape";

interface LivePageSegmentProps {
  params: Promise<{ slug: string; lang: string; pageSlug: string }>;
}

export async function generateMetadata({
  params,
}: LivePageSegmentProps): Promise<Metadata> {
  const { slug, lang, pageSlug } = await params;
  if (lang !== "en" && lang !== "ar") return {};
  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) return {};
  if (!result.snapshot.activeLanguages.includes(lang)) return {};
  const page = getTemplatePages(result.snapshot.templateId).find(
    (p) => p.slug === pageSlug
  );
  if (!page) return {};
  return livePageMetadata({
    slug,
    lang,
    snapshot: result.snapshot,
    pageId: page.id,
  });
}

export default async function LivePageSegment({ params }: LivePageSegmentProps) {
  const { slug, lang, pageSlug } = await params;
  if (lang !== "en" && lang !== "ar") notFound();

  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) notFound();
  if (!result.snapshot.activeLanguages.includes(lang)) notFound();

  const page = getTemplatePages(result.snapshot.templateId).find(
    (p) => p.slug === pageSlug
  );
  if (!page) notFound();

  return (
    <LiveSitePage
      slug={slug}
      lang={lang}
      snapshot={result.snapshot}
      businessInfo={result.businessInfo}
      pageId={page.id}
    />
  );
}
