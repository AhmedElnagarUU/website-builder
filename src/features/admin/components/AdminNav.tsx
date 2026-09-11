"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const NAV_ITEMS = ["overview", "users", "billing"] as const;

export function AdminNav({ locale }: { locale: string }) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const href = `/${locale}/admin/${item === "overview" ? "" : item}`;
        const isActive =
          item === "overview"
            ? pathname === `/${locale}/admin` || pathname === `/${locale}/admin/`
            : pathname.startsWith(`/${locale}/admin/${item}`);

        return (
          <Link
            key={item}
            href={href}
            className={`rounded-full border-2 px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-transparent text-ink hover:border-ink/20"
            }`}
          >
            {t(item)}
          </Link>
        );
      })}
    </nav>
  );
}
