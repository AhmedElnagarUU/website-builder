import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedSiteBySlug } from "@/features/publishing/get-published-site";
import {
  LiveSitePage,
  livePageMetadata,
} from "@/features/publishing/components/LiveSitePage";

interface LiveHomeProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({
  params,
}: LiveHomeProps): Promise<Metadata> {
  const { slug, lang } = await params;
  if (lang !== "en" && lang !== "ar") return {};
  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) return {};
  if (!result.snapshot.activeLanguages.includes(lang)) return {};
  return livePageMetadata({ slug, lang, snapshot: result.snapshot, pageId: "home" });
}

export default async function LiveHomePage({ params }: LiveHomeProps) {
  const { slug, lang } = await params;
  if (lang !== "en" && lang !== "ar") notFound();

  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) notFound();
  if (!result.snapshot.activeLanguages.includes(lang)) notFound();

  return (
    <LiveSitePage
      slug={slug}
      lang={lang}
      snapshot={result.snapshot}
      businessInfo={result.businessInfo}
      pageId="home"
    />
  );
}
