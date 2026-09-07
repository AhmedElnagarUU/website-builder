import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/features/auth/lib/session";
import { listSitesByOwner, toSiteDTO } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { getSiteAnalytics } from "@/features/analytics/api/get-site-analytics";
import { CreateSiteButton } from "@/features/dashboard/components/CreateSiteButton";
import { SiteCard } from "@/features/dashboard/components/SiteCard";
import { SiteAnalyticsPanel } from "@/features/dashboard/components/SiteAnalyticsPanel";
import type { SiteDTO, WizardStep } from "@/features/sites/types";
import type { SiteAnalyticsSummary } from "@/features/analytics/types";

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

  const publishedSites = sites.filter((s) => s.status === "published");
  const analyticsResults = await Promise.all(
    publishedSites.map(async (site) => {
      const result = await getSiteAnalytics(site._id);
      return { siteId: site._id, templateId: site.templateId, result };
    })
  );

  const analyticsMap = new Map<
    string,
    { templateId: string | null; data: SiteAnalyticsSummary }
  >();
  for (const { siteId, templateId, result } of analyticsResults) {
    if (result.ok) {
      analyticsMap.set(siteId, {
        templateId: templateId ?? null,
        data: result.data,
      });
    }
  }

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="mono-display text-5xl font-bold leading-none tracking-tight text-ink">
          {t("headline")}
        </h1>
        <div className="flex items-center gap-3">
          <a
            href={`/${locale}/dashboard/templates`}
            className="mono-display inline-flex items-center gap-1 rounded-full border-2 border-ink px-4 py-2 text-lg font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t("browse_templates")}
          </a>
          {cards.length > 0 && <CreateSiteButton />}
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-10 text-center shadow-mono">
          <p className="mono-display text-3xl font-bold text-ink">
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

      {publishedSites.length > 0 && (
        <div className="mt-10 space-y-6">
          {publishedSites.map((site) => {
            const entry = analyticsMap.get(site._id);
            if (!entry) return null;
            return (
              <SiteAnalyticsPanel
                key={site._id}
                templateId={entry.templateId}
                analytics={entry.data}
                locale={locale}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
