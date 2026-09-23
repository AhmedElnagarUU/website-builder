import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { listServicesForCurrentUser } from "@/features/services/api/list-services";
import { ServiceForm } from "@/features/services/components/ServiceForm";
import { DeleteServiceButton } from "@/features/services/components/DeleteServiceButton";
import { SectionHead } from "@/shared/ui";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string; siteId: string }>;
}) {
  const { locale, siteId } = await params;
  const t = await getTranslations("business");

  const result = await listServicesForCurrentUser(siteId, true);
  if (!result.ok) notFound();

  const services = result.services.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <SectionHead title={t("services.title")} className="mb-6" />

      <ServiceForm siteId={siteId} locale={locale} />

      {services.length === 0 ? (
        <div className="rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-mono">
          <p className="text-lg text-ink">{t("services.empty_title")}</p>
          <p className="mt-2 text-sm text-ink/60">{t("services.empty_body")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex items-center justify-between rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    service.active ? "bg-green-500" : "bg-gray-400"
                  }`} />
                  <h3 className="font-medium text-ink">{service.name}</h3>
                </div>
                {service.description && (
                  <p className="mt-1 text-sm text-ink/60 line-clamp-1">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="ml-4 flex gap-2">
                <DeleteServiceButton
                  siteId={siteId}
                  locale={locale}
                  serviceId={service._id}
                  serviceName={service.name}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
