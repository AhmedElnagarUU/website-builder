import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/shared/i18n/config";
import { notFound } from "next/navigation";
import { UserTable } from "@/features/admin/components/UserTable";

export default async function AdminUsersPage({
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
        Users
      </h1>
      <Suspense fallback={<p className="font-serif2 text-ink-2">Loading…</p>}>
        <UserTable locale={locale} />
      </Suspense>
    </section>
  );
}
