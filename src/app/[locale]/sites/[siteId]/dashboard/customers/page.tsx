import { getTranslations } from "next-intl/server";
import { listCustomersForCurrentUser } from "@/features/customers/api/list-customers";
import { SectionHead } from "@/shared/ui";

export default async function CustomersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; siteId: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { locale, siteId } = await params;
  const { search } = await searchParams;
  const t = await getTranslations("business");

  const result = await listCustomersForCurrentUser(
    siteId,
    search ?? undefined
  );

  const customers = result.ok ? result.customers : [];

  return (
    <div>
      <SectionHead title={t("customers.title")} className="mb-6" />

      <form method="GET" className="mb-4">
        <input
          type="text"
          name="search"
          defaultValue={search ?? ""}
          placeholder={t("customers.search")}
          className="w-full max-w-sm rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
        />
      </form>

      {customers.length === 0 ? (
        <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-mono">
          <p className="text-lg text-ink">{t("customers.no_customers")}</p>
          <p className="mt-2 text-sm text-ink/60">
            {t("customers.no_customers_desc")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-ink">
            <thead>
              <tr className="bg-paper-2">
                <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                  {t("customers.name")}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                  {t("customers.email")}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-ink">
                  {t("customers.phone")}
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-ink">
                  {t("customers.requests")}
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-ink">
                  {t("customers.since")}
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-t-2 border-ink">
                  <td className="px-3 py-2">
                    <a
                      href={`/${locale}/sites/${siteId}/dashboard/customers/${c._id}`}
                      className="text-sm font-medium text-ink hover:text-mono-red"
                    >
                      {c.name}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm text-ink/80">
                    {c.email ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-sm text-ink/80">
                    {c.phone ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-center text-sm text-ink">
                    {c.requestCount}
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-ink/60">
                    {new Date(c.createdAt).toLocaleDateString()}
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
