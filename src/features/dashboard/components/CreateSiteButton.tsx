"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { usePaywall } from "@/features/monetization/components/paywall-context";
import { paywallFromResponse } from "@/features/monetization/lib/paywall-client";

export function CreateSiteButton({
  ariaLabel,
}: {
  ariaLabel?: string;
}) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { showPaywall } = usePaywall();
  const [loading, setLoading] = useState(false);

  async function onCreate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sites", { method: "POST" });
      const body = await res.json().catch(() => null);
      const paywall = await paywallFromResponse(res);
      if (paywall) {
        showPaywall(paywall);
        setLoading(false);
        return;
      }
      if (!res.ok || !body?._id) {
        throw new Error("create failed");
      }
      router.push(`/${locale}/create/business-info?site=${body._id}`);
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="primary"
      onClick={onCreate}
      disabled={loading}
      aria-label={ariaLabel}
    >
      {loading ? t("creating") : t("new_site")}
      {!loading && <span className="rtl:rotate-180">→</span>}
    </Button>
  );
}
