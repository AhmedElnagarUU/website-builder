import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, toSiteDTO } from "@/features/sites/repository";
import { suggestLanguageFromLocation } from "@/shared/lib/arabic-regions";
import { LanguageChoice } from "@/features/create-wizard/components/LanguageChoice";
import { isLocale } from "@/shared/i18n/config";

export default async function LanguagePage({
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

  const dto = toSiteDTO(site);
  const suggested = suggestLanguageFromLocation(site.businessInfo.location);

  let initialChoice: "en" | "ar" | "both" | null = null;
  if (dto.languagesRequested.length === 2) initialChoice = "both";
  else if (dto.languagesRequested.length === 1) {
    initialChoice = dto.languagesRequested[0] as "en" | "ar";
  }

  return (
    <LanguageChoice
      siteId={siteId}
      locale={locale}
      suggested={suggested}
      initialChoice={initialChoice}
    />
  );
}