import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/shared/i18n/config";
import { notFound } from "next/navigation";
import { UserDetail } from "@/features/admin/components/UserDetail";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <a
        href={`/${locale}/admin/users`}
        className="mb-6 inline-block font-display text-sm font-semibold text-mono-red underline-offset-2 hover:underline"
      >
        ← Users
      </a>
      <UserDetail userId={userId} locale={locale} />
    </section>
  );
}
