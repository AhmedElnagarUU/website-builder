import { getTranslations } from "next-intl/server";
import { listRequestsForCurrentUser } from "@/features/requests/api/list-requests";
import { SectionHead } from "@/shared/ui";
import type { Locale } from "@/features/sites/types";
import type { RequestStatus } from "@/features/requests/types";

const STATUS_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "", labelKey: "all_statuses" },
  { value: "new", labelKey: "new" },
  { value: "contacted", labelKey: "contacted" },
  { value: "in_progress", labelKey: "in_progress" },
  { value: "completed", labelKey: "completed" },
  { value: "cancelled", labelKey: "cancelled" },
];

export default async function RequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; siteId: string }>;
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { locale, siteId } = await params;
  const { status, search } = await searchParams;
  const t = await getTranslations("business");
  const l = locale as Locale;

  const filters: { status?: RequestStatus; search?: string } = {};
  if (status && status !== "") filters.status = status as RequestStatus;
  if (search) filters.search = search;

  const result = await listRequestsForCurrentUser(siteId, filters);
  const requests = result.ok ? result.requests : [];

  return (
    <div>
      <SectionHead title={t("requests.title")} className="mb-6" />

      <form method="GET" className="mb-4 flex gap-3">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="w-48 rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(`requests.status_values.${opt.labelKey}`)}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="search"
          defaultValue={search ?? ""}
          placeholder={t("requests.search")}
          className="flex-1 rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
        />
        <button
          type="submit"
          className="rounded-[4px] border-2 border-ink bg-mono-red px-4 py-2 font-display text-sm font-semibold text-paper"
        >
          Filter
        </button>
      </form>

      {requests.length === 0 ? (
        <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-mono">
          <p className="text-lg text-ink">{t("requests.no_requests")}</p>
          <p className="mt-2 text-sm text-ink/60">
            {t("requests.no_requests_desc")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-ink">
            <thead>
              <tr className="bg-paper-2">
                <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                  {t("requests.customer")}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                  {t("requests.service")}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                  {t("requests.status")}
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-ink">
                  {t("requests.date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-t-2 border-ink">
                  <td className="px-3 py-2">
                    <a
                      href={`/${l}/sites/${siteId}/dashboard/requests/${req._id}`}
                      className="text-sm font-medium text-ink hover:text-mono-red"
                    >
                      {req.customerName}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-ink/80">
                    {req.serviceName ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block text-xs font-medium capitalize ${
                        req.status === "completed"
                          ? "text-green-600"
                          : req.status === "cancelled"
                          ? "text-gray-500"
                          : "text-mono-red"
                      }`}
                    >
                      {t(`requests.status_values.${req.status}`)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-ink/60">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
