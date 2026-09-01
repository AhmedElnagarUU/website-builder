import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, isLocale, dirFor } from "@/shared/i18n/config";
import { getSession } from "@/features/auth/lib/session";
import { Navbar } from "@/features/shell/components/Navbar";
import { Footer } from "@/features/shell/components/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [messages, session] = await Promise.all([
    getMessages(),
    getSession(),
  ]);

  return (
    <div
      lang={locale}
      dir={dirFor(locale)}
      className="vexa-page flex min-h-screen flex-col"
    >
      <NextIntlClientProvider messages={messages}>
        <Navbar isSignedIn={!!session} locale={locale} />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}