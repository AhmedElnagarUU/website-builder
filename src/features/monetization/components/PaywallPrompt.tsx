"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import type { PaywallInfo } from "../lib/paywall-client";

function getRestrictionHint(
  reason: PaywallInfo["reason"],
  t: (key: string) => string,
): string {
  switch (reason) {
    case "limit_reached":
      return t("upgrade_hint");
    case "requires_upgrade":
      return t("upgrade_hint");
    case "account_suspended":
      return t("site_not_deleted");
    case "account_frozen":
      return t("frozen_body");
    default:
      return t("upgrade_hint");
  }
}

export function PaywallPrompt({
  paywall,
  onClose,
}: {
  paywall: PaywallInfo;
  onClose: () => void;
}) {
  const t = useTranslations("paywall");
  const router = useRouter();

  const title = (() => {
    switch (paywall.reason) {
      case "limit_reached":
        return t("title_limit_reached");
      case "requires_upgrade":
        return t("title_requires_upgrade");
      case "account_suspended":
        return t("title_account_suspended");
      case "account_frozen":
        return t("title_account_frozen");
      default:
        return t("title_limit_reached");
    }
  })();

  const explanation = (() => {
    switch (paywall.reason) {
      case "limit_reached":
        return t("limit_reached_body");
      case "requires_upgrade":
        return t("requires_upgrade_body");
      case "account_suspended":
        return t("suspended_body");
      case "account_frozen":
        return t("frozen_body");
      default:
        return t("limit_reached_body");
    }
  })();

  function handleUpgrade() {
    onClose();
    router.push("/pricing");
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="mono-surface w-full max-w-md rounded-[4px] border-2 border-ink bg-paper p-6 shadow-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="mono-display text-lg font-semibold text-ink">
          {title}
        </h3>

        {/* Explanation */}
        <p className="font-serif2 mt-3 text-sm text-ink-2">
          {explanation}
        </p>

        {/* Restriction info */}
        <div className="mt-4 rounded-[4px] border-2 border-mono-red/30 bg-paper-2 p-3">
          <p className="mono-display text-sm text-ink">
            {paywall.plan === "pro" ? t("plan_pro") : t("plan_free")}
          </p>
          <p className="mt-1 font-serif2 text-xs text-ink-2">
            {getRestrictionHint(paywall.reason, t)}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleUpgrade}
          >
            {paywall.reason === "account_suspended"
              ? t("reactivate")
              : t("upgrade")}
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={onClose}
          >
            {t("close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
