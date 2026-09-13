"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PlanBadge } from "@/features/monetization/components/PlanBadge";
import { type Locale } from "@/shared/i18n/config";
import type { PlanId } from "@/features/monetization/types";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M3 3l8 8" />
          <path d="M11 3l-8 8" />
        </>
      ) : (
        <>
          <path d="M1.5 4h11" />
          <path d="M1.5 7h11" />
          <path d="M1.5 10h11" />
        </>
      )}
    </svg>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);

  async function onSignOut() {
    setMenuOpen(false);
    await authClient.signOut();
    router.push(`/${locale}/auth/sign-in`);
    router.refresh();
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="relative border-b-2 border-ink bg-paper-2/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <a
          href={`/${locale}`}
          className="mono-display flex min-w-0 items-baseline gap-1.5 truncate text-3xl font-bold text-ink"
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

        <div className="hidden items-center gap-2 md:flex">
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

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("nav.close") : t("nav.menu")}
          title={menuOpen ? t("nav.close") : t("nav.menu")}
          className="mono-display flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-ink hover:text-paper md:hidden"
        >
          <MenuIcon open={menuOpen} />
          <span>{menuOpen ? t("nav.close") : t("nav.menu")}</span>
        </button>
      </nav>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-full z-50 border-b-2 border-ink bg-paper-2 px-4 py-3 md:hidden">
            <div className="mono-display flex flex-col items-stretch gap-2">
              {isLanding && (
                <>
                  <a
                    href="#how"
                    onClick={() => setMenuOpen(false)}
                    className="text-[19px] font-medium transition-colors hover:text-mono-red"
                  >
                    {t("landing.nav.how")}
                  </a>
                  <a
                    href="#features"
                    onClick={() => setMenuOpen(false)}
                    className="text-[19px] font-medium transition-colors hover:text-mono-red"
                  >
                    {t("landing.nav.what")}
                  </a>
                  <a
                    href="#languages"
                    onClick={() => setMenuOpen(false)}
                    className="text-[19px] font-medium transition-colors hover:text-mono-red"
                  >
                    {t("landing.nav.languages")}
                  </a>
                  <a
                    href="#proof"
                    onClick={() => setMenuOpen(false)}
                    className="text-[19px] font-medium transition-colors hover:text-mono-red"
                  >
                    {t("landing.nav.proof")}
                  </a>
                </>
              )}
              {isSignedIn ? (
                <>
                  {planId && <PlanBadge plan={planId} />}
                  {planId !== "pro" && (
                    <a
                      href={`/${locale}/pricing`}
                      onClick={() => setMenuOpen(false)}
                      className="mono-display rounded-full border-2 border-ink bg-ink px-4 py-1 text-lg leading-none text-paper transition-colors hover:bg-paper hover:text-ink"
                    >
                      {t("nav.upgrade")}
                    </a>
                  )}
                  <a
                    href={`/${locale}/dashboard`}
                    onClick={() => setMenuOpen(false)}
                    className="mono-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
                  >
                    {t("nav.dashboard")}
                  </a>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="mono-display rounded-full px-3 py-1 text-start text-lg leading-none text-ink transition-colors hover:bg-paper-2"
                  >
                    {t("nav.sign_out")}
                  </button>
                </>
              ) : (
                <>
                  <a
                    href={`/${locale}/auth/sign-in`}
                    onClick={() => setMenuOpen(false)}
                    className="mono-display rounded-full px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
                  >
                    {t("nav.sign_in")}
                  </a>
                  <a
                    href={`/${locale}/auth/sign-up`}
                    onClick={() => setMenuOpen(false)}
                    className="mono-display rounded-full border-2 border-ink px-4 py-1 text-lg leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    {t("nav.sign_up")}
                  </a>
                </>
              )}
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </>
      )}
    </header>
  );
}