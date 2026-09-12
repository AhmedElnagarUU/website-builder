"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PlanBadge } from "@/features/monetization/components/PlanBadge";
import { type Locale } from "@/shared/i18n/config";
import type { PlanId } from "@/features/monetization/types";

export function Navbar({
  isSignedIn,
  planId,
  locale,
}: {
  isSignedIn: boolean;
  planId: PlanId | null;
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
          className="mono-display flex items-baseline gap-1.5 text-3xl font-bold text-ink"
        >
          {t("app.name")}
          <span className="mono-display text-base text-mono-red">✱</span>
        </a>

        {isLanding && (
          <div className="mono-display hidden items-center gap-6 text-[19px] font-medium md:flex">
            <a href="#how" className="transition-colors hover:text-mono-red">
              {t("landing.nav.how")}
            </a>
            <a href="#features" className="transition-colors hover:text-mono-red">
              {t("landing.nav.what")}
            </a>
            <a href="#languages" className="transition-colors hover:text-mono-red">
              {t("landing.nav.languages")}
            </a>
            <a href="#proof" className="transition-colors hover:text-mono-red">
              {t("landing.nav.proof")}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              {planId && <PlanBadge plan={planId} />}
              {planId !== "pro" && (
                <a
                  href={`/${locale}/pricing`}
                  className="mono-display rounded-full border-2 border-ink bg-ink px-4 py-1 text-lg leading-none text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  {t("nav.upgrade")}
                </a>
              )}
              <a
                href={`/${locale}/dashboard`}
                className="mono-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
              >
                {t("nav.dashboard")}
              </a>
              <button
                type="button"
                onClick={onSignOut}
                className="mono-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
              >
                {t("nav.sign_out")}
              </button>
            </>
          ) : (
            <>
              <a
                href={`/${locale}/auth/sign-in`}
                className="mono-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
              >
                {t("nav.sign_in")}
              </a>
              <a
                href={`/${locale}/auth/sign-up`}
                className="mono-display rounded-full border-2 border-ink px-4 py-1 text-lg leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
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