import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCustomerForCurrentUser } from "@/features/customers/api/get-customer";
import { listRequestsForCurrentUser } from "@/features/requests/api/list-requests";
import { UpdateCustomerNotesForm } from "@/features/customers/components/UpdateCustomerNotesForm";
import { SectionHead } from "@/shared/ui";
import type { Locale } from "@/features/sites/types";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; siteId: string; customerId: string }>;
}) {
  const { locale, siteId, customerId } = await params;
  const t = await getTranslations("business");
  const l = locale as Locale;

  const customerResult = await getCustomerForCurrentUser(siteId, customerId);
  if (!customerResult.ok) notFound();
  const { customer, requestCount } = customerResult;

  const requestsResult = await listRequestsForCurrentUser(siteId, {
    search: customer.name,
  });
  const customerRequests = requestsResult.ok
    ? requestsResult.requests.filter((r) => r.customerId === customerId)
    : [];

  return (
    <div>
      <SectionHead
        title={customer.name}
        className="mb-6"
      />

      <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
        <h3 className="mono-display text-sm font-semibold text-ink mb-3">
          {t("customers.notes")}
        </h3>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium text-ink">Email:</span>{" "}
            {customer.email ?? "—"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-ink">Phone:</span>{" "}
            {customer.phone ?? "—"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-ink">Customer Since:</span>{" "}
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-ink">Total Requests:</span>{" "}
            {requestCount}
          </p>
        </div>

        <UpdateCustomerNotesForm
          siteId={siteId}
          locale={l}
          customerId={customerId}
          currentNotes={customer.notes ?? []}
        />
      </div>

      <div>
        <h3 className="mono-display text-lg font-semibold text-ink mb-3">
          {t("requests.title")}
        </h3>
        {customerRequests.length === 0 ? (
          <p className="text-sm text-ink/60">No requests from this customer.</p>
        ) : (
          <div className="space-y-2">
            {customerRequests.map((req) => (
              <div
                key={req._id}
                className="rounded-[4px] border border-ink bg-paper-2 p-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium text-ink">
                      {req.serviceName ?? t("requests.service")}
                    </span>
                    <span className={`ml-2 inline-block text-xs capitalize ${
                      req.status === "completed"
                        ? "text-green-600"
                        : req.status === "cancelled"
                        ? "text-gray-500"
                        : "text-mono-red"
                    }`}>
                      {t(`requests.status_values.${req.status}`)}
                    </span>
                  </div>
                  <span className="text-xs text-ink/60">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {req.message && (
                  <p className="mt-1 text-sm text-ink/80 line-clamp-2">
                    {req.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
