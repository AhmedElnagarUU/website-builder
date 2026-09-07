"use client";

import { useTranslations } from "next-intl";
import type { PublishedSnapshot, SiteStatus } from "@/features/sites/types";

export function LiveStatusIndicator({
  status,
  publishedSnapshot,
}: {
  status: SiteStatus;
  publishedSnapshot: PublishedSnapshot | null;
}) {
  const t = useTranslations();
  const live = status === "published" && publishedSnapshot !== null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/30 bg-paper-2 px-3 py-1 text-xs font-medium text-ink"
      title={t("editor.live.hint")}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          live ? "animate-pulse bg-mono-green" : "bg-mono-red"
        }`}
      />
      {live ? t("editor.live.live") : t("editor.live.not_live")}
    </span>
  );
}