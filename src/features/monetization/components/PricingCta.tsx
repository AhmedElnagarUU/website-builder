"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { CheckoutSection } from "@/features/payments/components/checkout-section";

export function PricingCta() {
  const t = useTranslations("pricing");
  const router = useRouter();
  const locale = useLocale();
  const { data: session, isPending } = authClient.useSession();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function handleUpgrade() {
    if (session?.user) {
      setCheckoutOpen(true);
      return;
    }
    if (isPending) return;
    router.push(`/${locale}/auth/sign-in`);
  }

  if (checkoutOpen) {
    return (
      <CheckoutSection initialOpen={true} />
    );
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