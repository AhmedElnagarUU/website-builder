"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";

const POLAR_PRODUCT_ID_PRO =
  process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PRO || "a46de6f5-57cb-466d-9afa-ca08c1704dae";

export function PricingCta() {
  const t = useTranslations("pricing");
  const router = useRouter();
  const locale = useLocale();
  const { data: session, isPending } = authClient.useSession();

  function handleUpgrade() {
    if (session?.user) {
      window.location.assign(
        `/api/checkout?products=${encodeURIComponent(POLAR_PRODUCT_ID_PRO)}`
      );
      return;
    }
    if (isPending) return;
    router.push(`/${locale}/auth/sign-in`);
  }

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      className="mono-display w-full rounded-[4px] border-2 border-ink bg-ink px-4 py-2 text-lg font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
    >
      {t("choose_pro")}
    </button>
  );
}