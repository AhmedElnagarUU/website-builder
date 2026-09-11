import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/shared/i18n/config";
import { notFound } from "next/navigation";

export default async function AdminBillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mono-display mb-8 text-5xl font-bold leading-none tracking-tight text-ink">
        Billing
      </h1>
      <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-10 text-center shadow-mono">
        <p className="mono-display text-2xl font-bold text-ink">
          Manage billing per user
        </p>
        <p className="font-serif2 mt-3 text-ink-2">
          Go to a user&apos;s detail page to edit their subscription or record a payment.
        </p>
        <a
          href={`/${locale}/admin/users`}
          className="mt-6 inline-block rounded-full border-2 border-ink bg-ink px-5 py-2 font-display text-sm font-semibold text-paper transition-colors hover:bg-transparent hover:text-ink"
        >
          Browse Users
        </a>
      </div>
    </section>
  );
}
