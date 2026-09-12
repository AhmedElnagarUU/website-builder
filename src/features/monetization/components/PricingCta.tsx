"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function PricingCta() {
  const t = useTranslations("pricing");
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowNotice((v) => !v)}
        className="mono-display w-full rounded-[4px] border-2 border-ink bg-ink px-4 py-2 text-lg font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
      >
        {t("choose_pro")}
      </button>
      {showNotice && (
        <p
          role="status"
          className="font-serif2 mt-3 text-sm leading-relaxed text-ink-2"
        >
          {t("coming_soon")}
        </p>
      )}
    </div>
  );
}