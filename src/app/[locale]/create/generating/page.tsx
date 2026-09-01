import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { GenerationProgress } from "@/features/create-wizard/components/GenerationProgress";
import { isLocale } from "@/shared/i18n/config";

export default async function GeneratingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ site?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect(`/${locale}/dashboard`);
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/sign-in`);

  const { site: siteId } = await searchParams;
  if (!siteId) redirect(`/${locale}/dashboard`);

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) redirect(`/${locale}/dashboard`);

  return <GenerationProgress siteId={siteId} locale={locale} />;
}