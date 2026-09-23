import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getOverviewForCurrentUser } from "@/features/dashboard/api/get-overview";
import { SectionHead } from "@/shared/ui";

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; siteId: string }>;
}) {
  const { locale, siteId } = await params;
  const t = await getTranslations("business");

  const result = await getOverviewForCurrentUser(siteId);

  if (!result.ok) {
    if (result.error === "unauthorized") {
      redirect(`/${locale}/auth/sign-in`);
    }
    return <div className="text-red-500">Error loading dashboard</div>;
  }

  const { data } = result;
  const stats = [
    { label: t("overview.stats.customers"), value: data.totalCustomers },
    { label: t("overview.stats.requests"), value: data.totalRequests },
    { label: t("overview.stats.pending"), value: data.newRequests },
    { label: t("overview.stats.completed"), value: data.completedRequests },
  ];

  return (
    <div>
      <SectionHead
        title={t("overview.welcome")}
        className="mb-8"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[4px] border-2 border-ink bg-paper-2 px-4 py-4 text-center shadow-mono"
          >
            <div className="text-3xl font-bold text-ink">{s.value}</div>
            <div className="text-xs text-ink/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mono-display text-lg font-semibold text-ink mb-4">
          {t("overview.recent")}
        </h3>
        {data.recentRequests.length === 0 ? (
          <p className="text-sm text-ink/60">{t("overview.no_recent")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-ink">
              <thead>
                <tr className="bg-paper-2">
                  <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                    Customer
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                    Service
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-ink">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentRequests.map((r) => (
                  <tr key={r._id} className="border-t-2 border-ink">
                    <td className="px-3 py-2 text-sm">{r.customerName}</td>
                    <td className="px-3 py-2 text-sm">
                      {r.serviceName ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-sm capitalize">
                      {r.status.replace("_", " ")}
                    </td>
                    <td className="px-3 py-2 text-right text-sm">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
