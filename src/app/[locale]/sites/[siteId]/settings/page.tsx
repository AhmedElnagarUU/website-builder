import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, toSiteDTO } from "@/features/sites/repository";
import { SettingsPageContent } from "@/features/sites/components/SettingsPageContent";
import { isLocale } from "@/shared/i18n/config";
import type { Locale, SiteDTO } from "@/features/sites/types";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string; siteId: string }>;
}) {
  const { locale, siteId } = await params;
  if (!isLocale(locale)) redirect(`/${locale}/dashboard`);
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/sign-in`);

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) notFound();

  // Settings page is accessible once the site has been created and has a template
  // Redirect back through the wizard if the site isn't ready yet
  if (site.currentStep === "generating") {
    redirect(`/${locale}/create/generating?site=${siteId}`);
  }
  if (site.currentStep === "business_info") {
    redirect(`/${locale}/create/business-info?site=${siteId}`);
  }
  if (site.currentStep === "templates") {
    redirect(`/${locale}/create/templates?site=${siteId}`);
  }
  if (site.currentStep === "language") {
    redirect(`/${locale}/create/language?site=${siteId}`);
  }

  const siteDTO: SiteDTO = toSiteDTO(site);

  return (
    <SettingsPageContent
      siteId={siteId}
      locale={locale as Locale}
      site={siteDTO}
    />
  );
}
