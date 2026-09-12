import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.privacy");

  const sections = [
    { title: t("s1_title"), body: t("s1_body") },
    { title: t("s2_title"), body: t("s2_body") },
    { title: t("s3_title"), body: t("s3_body") },
    { title: t("s4_title"), body: t("s4_body") },
    { title: t("s5_title"), body: t("s5_body") },
  ];

  return (
    <section className="container mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mono-display text-5xl font-bold leading-none tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mono-display mt-3 text-sm text-ink-3">{t("last_updated")}</p>

      <div className="mt-10 space-y-10">
        {sections.map(({ title, body }) => (
          <div key={title}>
            <h2 className="mono-display text-2xl font-bold text-ink">{title}</h2>
            <p className="font-serif2 mt-3 leading-relaxed text-ink-2">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}