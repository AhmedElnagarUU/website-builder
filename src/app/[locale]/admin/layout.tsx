import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, dirFor } from "@/shared/i18n/config";
import { requireAdmin } from "@/features/admin/lib/roles";
import { AdminNav } from "@/features/admin/components/AdminNav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  await requireAdmin(locale);

  const messages = await getMessages();

  return (
    <div lang={locale} dir={dirFor(locale)} className="mono-page flex min-h-screen flex-col">
      <NextIntlClientProvider messages={messages}>
        <header className="border-b-2 border-ink bg-paper">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
            <a
              href={`/${locale}/admin`}
              className="font-display text-xl font-bold text-ink"
            >
              Monomastic Admin
            </a>
            <div className="flex items-center gap-4">
              <AdminNav locale={locale} />
              <a
                href={`/${locale}/dashboard`}
                className="rounded-full border-2 border-ink px-4 py-1.5 font-display text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Dashboard
              </a>
            </div>
          </div>
        </header>
        <main className="relative z-10 flex-1">{children}</main>
      </NextIntlClientProvider>
    </div>
  );
}
