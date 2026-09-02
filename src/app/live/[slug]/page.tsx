import { notFound, redirect } from "next/navigation";
import { getPublishedSiteBySlug } from "@/features/publishing/get-published-site";

interface LiveRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function LiveSiteRedirect({ params }: LiveRedirectProps) {
  const { slug } = await params;
  const result = await getPublishedSiteBySlug(slug);
  if (!result.ok) {
    notFound();
  }
  const defaultLang =
    result.snapshot.activeLanguages[0] ?? "en";
  redirect(`/live/${slug}/${defaultLang}`);
}
