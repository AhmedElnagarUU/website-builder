export function nextUrl(slug: string, host?: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITES_DOMAIN ||
    process.env.VERCEL_URL ||
    host ||
    "localhost:3000";
  const origin = base.startsWith("http") ? base : `https://${base}`;
  return `${origin}/live/${slug}`;
}
