"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { type Locale } from "@/shared/i18n/config";

export function Navbar({
  isSignedIn,
  locale,
}: {
  isSignedIn: boolean;
  locale: Locale;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === `/${locale}` || pathname === `/${locale}/`;

  async function onSignOut() {
    await authClient.signOut();
    router.push(`/${locale}/auth/sign-in`);
    router.refresh();
  }

  return (
    <header className="border-b-2 border-ink bg-paper-2/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <a
          href={`/${locale}`}
          className="vexa-display flex items-baseline gap-1.5 text-3xl font-bold text-ink"
        >
          {t("app.name")}
          <span className="vexa-display text-base text-vexa-red">✱</span>
        </a>

        {isLanding && (
          <div className="vexa-display hidden items-center gap-6 text-[19px] font-medium md:flex">
            <a href="#how" className="transition-colors hover:text-vexa-red">
              {t("landing.nav.how")}
            </a>
            <a href="#features" className="transition-colors hover:text-vexa-red">
              {t("landing.nav.what")}
            </a>
            <a href="#languages" className="transition-colors hover:text-vexa-red">
              {t("landing.nav.languages")}
            </a>
            <a href="#proof" className="transition-colors hover:text-vexa-red">
              {t("landing.nav.proof")}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <a
                href={`/${locale}/dashboard`}
                className="vexa-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
              >
                {t("nav.dashboard")}
              </a>
              <button
                type="button"
                onClick={onSignOut}
                className="vexa-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
              >
                {t("nav.sign_out")}
              </button>
            </>
          ) : (
            <>
              <a
                href={`/${locale}/auth/sign-in`}
                className="vexa-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
              >
                {t("nav.sign_in")}
              </a>
              <a
                href={`/${locale}/auth/sign-up`}
                className="vexa-display rounded-full border-2 border-ink px-4 py-1 text-lg leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {t("nav.sign_up")}
              </a>
            </>
          )}
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </nav>
    </header>
  );
}