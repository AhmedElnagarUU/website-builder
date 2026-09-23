import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { isLocale } from "@/shared/i18n/config";
import type { Locale } from "@/features/sites/types";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string; siteId: string }>;
}) {
  const { locale, siteId } = await params;
  if (!isLocale(locale)) redirect(`/${locale}/dashboard`);
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) redirect(`/${locale}/auth/sign-in`);

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) notFound();

  const l = locale as Locale;
  const basePath = `/${l}/sites/${siteId}/dashboard`;

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r-2 border-ink bg-paper-2 p-4 pt-6">
        <div className="mb-6">
          <h1 className="mono-display text-xl font-bold text-ink">
            {site.businessInfo?.name || "My Business"}
          </h1>
          <p className="text-xs text-ink/60">Business Dashboard</p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href={basePath}
            className="rounded-[4px] px-3 py-2 text-sm font-medium text-ink hover:bg-mono-red hover:text-paper transition-colors"
          >
            Overview
          </Link>
          <Link
            href={`${basePath}/services`}
            className="rounded-[4px] px-3 py-2 text-sm font-medium text-ink hover:bg-mono-red hover:text-paper transition-colors"
          >
            Services
          </Link>
          <Link
            href={`${basePath}/customers`}
            className="rounded-[4px] px-3 py-2 text-sm font-medium text-ink hover:bg-mono-red hover:text-paper transition-colors"
          >
            Customers
          </Link>
          <Link
            href={`${basePath}/requests`}
            className="rounded-[4px] px-3 py-2 text-sm font-medium text-ink hover:bg-mono-red hover:text-paper transition-colors"
          >
            Requests
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
