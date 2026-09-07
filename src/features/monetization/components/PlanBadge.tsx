"use client";

import { useTranslations } from "next-intl";
import type { PlanId } from "../types";

export function PlanBadge({ plan }: { plan: PlanId }) {
  const t = useTranslations("plan");
  return (
    <span className="mono-display whitespace-nowrap rounded-full border-2 border-ink/30 px-3 py-1 text-[15px] leading-none text-ink">
      {t("current_plan")}: {t(plan)}
    </span>
  );
}