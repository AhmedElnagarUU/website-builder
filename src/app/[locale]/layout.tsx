import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, isLocale } from "@/shared/i18n/config";
import { getSession } from "@/features/auth/lib/session";
import { resolveSubscriptionForUser } from "@/features/monetization/repository";
import { PaywallProvider } from "@/features/monetization/components/paywall-context";
import { Navbar } from "@/features/shell/components/Navbar";
import { Footer } from "@/features/shell/components/Footer";
import { TutorialProvider } from "@/features/tutorial/components/TutorialProvider";
import { TutorialRenderer } from "@/features/tutorial/TutorialRenderer";
import type { PlanId } from "@/features/monetization/types";

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

  let planId: PlanId | null = null;
  if (session) {
    const subscription = await resolveSubscriptionForUser(session.user.id);
    planId = subscription.planId;
  }

  return (
    <div className="mono-page flex min-h-screen flex-col">
      <NextIntlClientProvider messages={messages}>
        <PaywallProvider>
          <TutorialProvider>
            <Navbar isSignedIn={!!session} planId={planId} locale={locale} />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer locale={locale} />
            <TutorialRenderer locale={locale} />
          </TutorialProvider>
        </PaywallProvider>
      </NextIntlClientProvider>
    </div>
  );
}
