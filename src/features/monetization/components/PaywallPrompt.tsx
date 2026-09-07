"use client";

import { useTranslations } from "next-intl";
import type { PaywallInfo } from "../lib/paywall-client";

export function PaywallPrompt({
  paywall,
  onClose,
}: {
  paywall: PaywallInfo;
  onClose: () => void;
}) {
  const t = useTranslations("paywall");

  const title = (() => {
    switch (paywall.reason) {
      case "limit_reached":
        return t("limit_reached");
      case "requires_upgrade":
        return t("requires_upgrade");
      case "account_frozen":
        return t("account_frozen");
      case "account_suspended":
        return t("account_suspended");
    }
  })();

  const hint = (() => {
    switch (paywall.reason) {
      case "account_frozen":
      case "account_suspended":
        return t("account_hint");
      default:
        return t("upgrade_hint");
    }
  })();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="mono-surface w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mono-display mb-2 text-lg font-semibold text-ink">
          {paywall.plan === "pro" ? t("plan_pro") : t("plan_free")}
        </div>
        <p className="mb-4 text-start text-sm text-ink">{title}</p>
        <p className="mb-6 text-start text-xs text-ink-2">{hint}</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[4px] border-2 border-ink bg-paper px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}