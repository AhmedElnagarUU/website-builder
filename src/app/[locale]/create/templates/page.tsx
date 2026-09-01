import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, toSiteDTO } from "@/features/sites/repository";
import { rankTemplatesByCategory } from "@/features/templates/api/list-templates";
import { TemplatePicker } from "@/features/create-wizard/components/TemplatePicker";
import { isLocale } from "@/shared/i18n/config";

export default async function TemplatesPage({
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

  const ranked = rankTemplatesByCategory(site.businessInfo.category);
  const dto = toSiteDTO(site);

  return (
    <TemplatePicker
      siteId={siteId}
      locale={locale}
      initialTemplateId={dto.templateId}
      suggested={ranked.data.suggested}
      others={ranked.data.others}
    />
  );
}