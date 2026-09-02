import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { EditorShell } from "@/features/editor/components/EditorShell";
import { isLocale } from "@/shared/i18n/config";
import type { Locale } from "@/features/sites/types";

export default async function EditorPage({
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

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) notFound();

  const activeLanguages = site.activeLanguages.length
    ? site.activeLanguages
    : ([locale] as Locale[]);

  return (
    <EditorShell
      siteId={siteId}
      appLocale={locale}
      template={template}
      businessInfo={site.businessInfo}
      images={site.images}
      brandColor={site.brandColor || template.colors.defaultAccent}
      s3PublicBaseUrl={process.env.S3_PUBLIC_BASE_URL}
      initialContent={site.content}
      activeLanguages={activeLanguages}
      status={site.status}
      publishedSnapshot={site.publishedSnapshot}
      hasUnpublishedChanges={site.hasUnpublishedChanges}
    />
  );
}
