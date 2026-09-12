export function nextUrl(
  slug: string,
  pageSlug?: string,
  host?: string
): string {
  const base =
    process.env.NEXT_PUBLIC_SITES_DOMAIN ||
    process.env.VERCEL_URL ||
    host ||
    "localhost:3001";
  const origin = base.startsWith("http") ? base : `https://${base}`;
  const pageSeg = pageSlug && pageSlug !== "" ? `/${pageSlug}` : "";
  return `${origin}/live/${slug}${pageSeg}`;
}

export function livePageBaseUrl(slug: string, lang: string, host?: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITES_DOMAIN ||
    process.env.VERCEL_URL ||
    host ||
    "localhost:3001";
  const origin = base.startsWith("http") ? base : `https://${base}`;
  return `${origin}/live/${slug}/${lang}`;
}
