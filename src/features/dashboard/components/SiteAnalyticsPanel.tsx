import { getTranslations } from "next-intl/server";
import { getTemplate } from "@/features/templates/api/list-templates";
import type { SiteAnalyticsSummary } from "@/features/analytics/types";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[4px] border-[1.5px] border-ink bg-paper p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
        {label}
      </p>
      <p className="mono-display mt-1 text-3xl font-bold text-ink">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export async function SiteAnalyticsPanel({
  templateId,
  analytics,
  locale,
}: {
  templateId: string | null;
  analytics: SiteAnalyticsSummary;
  locale: string;
}) {
  const t = await getTranslations("analytics");
  const loc = locale as "en" | "ar";

  const template = templateId ? getTemplate(templateId) : null;
  const pageLabel = (slug: string): string => {
    const page = template?.pages.find((p) => p.slug === slug || p.id === slug);
    return page?.name[loc] ?? (slug === "home" ? t("home_page") : slug);
  };

  const isEmpty = analytics.totalViews === 0;
  const maxTrend = Math.max(...analytics.trend.map((d) => d.views), 1);

  return (
    <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
      <h3 className="mono-display text-2xl font-bold text-ink">
        {t("title")}
      </h3>
      <p className="mt-1 font-serif2 text-sm text-ink-3">{t("note")}</p>

      {isEmpty ? (
        <p className="mt-6 text-center font-serif2 text-ink-3">
          {t("empty")}
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <StatCard label={t("total_views")} value={analytics.totalViews} />
            <StatCard label={t("last_7_days")} value={analytics.last7Days} />
            <StatCard
              label={t("last_30_days")}
              value={analytics.last30Days}
            />
          </div>

          <div className="mt-6">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
              {t("per_page")}
            </h4>
            <div className="mt-3 space-y-2">
              {analytics.perPage.map((row) => (
                <div
                  key={`${row.page}:${row.locale}`}
                  className="flex items-center justify-between border-b border-dashed border-ink/20 pb-2"
                >
                  <span className="font-serif2 text-ink">
                    {pageLabel(row.page)}
                    <span className="ms-2 font-mono text-[11px] text-ink-3">
                      {row.locale.toUpperCase()}
                    </span>
                  </span>
                  <span className="font-mono text-sm font-bold text-ink">
                    {row.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
              {t("trend")}
            </h4>
            <div className="mt-3 flex h-16 items-end gap-px">
              {analytics.trend.map((day) => {
                const pct =
                  maxTrend > 0 ? (day.views / maxTrend) * 100 : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 rounded-t-sm bg-ink/20"
                    style={{ height: `${pct}%` }}
                    title={`${day.date}: ${day.views}`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
