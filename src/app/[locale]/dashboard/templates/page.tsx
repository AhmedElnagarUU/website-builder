import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/features/auth/lib/session";
import { TemplateGallery } from "@/features/templates/components/TemplateGallery";
import { isLocale } from "@/shared/i18n/config";

export default async function DashboardTemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.gallery");
  await requireSession(locale);

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="vexa-display text-5xl font-bold leading-none tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="font-serif2 mt-3 max-w-xl text-ink-2">{t("subtitle")}</p>
      </div>

      <TemplateGallery locale={locale as "en" | "ar"} />
    </section>
  );
}
