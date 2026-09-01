import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/features/auth/lib/session";
import { listSitesByOwner, toSiteDTO } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { CreateSiteButton } from "@/features/dashboard/components/CreateSiteButton";
import { SiteCard } from "@/features/dashboard/components/SiteCard";
import type { SiteDTO, WizardStep } from "@/features/sites/types";

function siteStepHref(locale: string, site: SiteDTO): string {
  const base = `/${locale}/create`;
  switch (site.currentStep) {
    case "business_info":
      return `${base}/business-info?site=${site._id}`;
    case "templates":
      return `${base}/templates?site=${site._id}`;
    case "language":
      return `${base}/language?site=${site._id}`;
    case "generating":
      return `${base}/generating?site=${site._id}`;
    case "editing":
      return `/${locale}/sites/${site._id}/editor`;
  }
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const session = await requireSession(locale);

  const sites = (await listSitesByOwner(session.user.id)).map(toSiteDTO);
  sites.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const cards = sites.map((site) => {
    const template = site.templateId ? getTemplate(site.templateId) : null;
    const accent =
      site.brandColor || template?.colors.defaultAccent || "#B23A48";
    return {
      site,
      templateName: template?.name[locale as "en" | "ar"] ?? null,
      accent,
      href: siteStepHref(locale, site),
      stepKey: site.currentStep as WizardStep,
    };
  });

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="vexa-display text-5xl font-bold leading-none tracking-tight text-ink">
          {t("headline")}
        </h1>
        {cards.length > 0 && <CreateSiteButton />}
      </div>

      {cards.length === 0 ? (
        <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-10 text-center shadow-vexa">
          <p className="vexa-display text-3xl font-bold text-ink">
            {t("empty_title")}
          </p>
          <p className="font-serif2 mx-auto mt-3 max-w-md text-ink-2">
            {t("empty_body")}
          </p>
          <div className="mt-6">
            <CreateSiteButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <SiteCard key={c.site._id} {...c} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
