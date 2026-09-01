import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, toSiteDTO } from "@/features/sites/repository";
import { BusinessInfoForm } from "@/features/create-wizard/components/BusinessInfoForm";
import { isLocale } from "@/shared/i18n/config";

export default async function BusinessInfoPage({
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

  return <BusinessInfoForm siteId={siteId} initial={toSiteDTO(site)} locale={locale} />;
}