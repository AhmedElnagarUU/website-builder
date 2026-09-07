"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePaywall } from "@/features/monetization/components/paywall-context";
import { paywallFromResponse } from "@/features/monetization/lib/paywall-client";

interface StatusData {
  status: "idle" | "queued" | "running" | "complete" | "failed";
  localesDone: number;
  localesTotal: number;
}

export function RegenerateSiteControl({
  siteId,
  onDone,
}: {
  siteId: string;
  onDone: () => void;
}) {
  const t = useTranslations();
  const { showPaywall } = usePaywall();
  const [showConfirm, setShowConfirm] = useState(false);
  const [working, setWorking] = useState(false);
  const statusRef = useRef<StatusData>({ status: "idle", localesDone: 0, localesTotal: 0 });
  const [, forceRender] = useState(0);

  const launch = async (withConfirm: boolean) => {
    setShowConfirm(false);
    const res = await fetch(`/api/sites/${siteId}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: withConfirm ? JSON.stringify({ confirm: true }) : undefined,
    });
    const paywall = await paywallFromResponse(res);
    if (paywall) {
      showPaywall(paywall);
      setWorking(false);
      return;
    }
    if (res.status === 202) {
      setWorking(true);
    }
  };

  const handleClick = async () => {
    try {
      const res = await fetch(`/api/sites/${siteId}/regenerate-impact`);
      const data = await res.json().catch(() => ({ userEditedCount: 0 }));
      if (data.userEditedCount > 0) {
        setShowConfirm(true);
      } else {
        await launch(false);
      }
    } catch {
      await launch(false);
    }
  };

  useEffect(() => {
    if (!working) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/sites/${siteId}/generation-status`);
        const data = (await res.json()) as StatusData;
        if (cancelled) return;
        statusRef.current = data;
        forceRender((n) => n + 1);
        if (data.status === "complete" || data.status === "failed") {
          setWorking(false);
          onDone();
          return;
        }
      } catch {
        if (cancelled) return;
      }
      timer = setTimeout(tick, 2000);
    }

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [working, siteId, onDone]);

  const status = statusRef.current;

  return (
    <>
      {working && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="mono-surface flex w-full max-w-sm flex-col items-center gap-4 p-6 text-center">
            <div
              aria-hidden
              className="h-8 w-8 animate-spin rounded-full border-2 border-dashed border-mono-red"
            />
            <p className="text-sm text-ink">
              {status.localesTotal > 0
                ? `${status.localesDone}/${status.localesTotal}`
                : t("wizard.generating.title")}
            </p>
          </div>
        </div>
      )}

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="mono-surface w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-start text-sm text-ink">{t("editor.regenerate.confirm")}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded border border-input px-3 py-2 text-sm"
              >
                {t("editor.regenerate.cancel")}
              </button>
              <button
                type="button"
                onClick={() => launch(true)}
                className="rounded bg-mono-red px-3 py-2 text-sm text-white"
              >
                {t("editor.regenerate.confirm_btn")}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="rounded border border-input bg-background px-2 py-1 text-xs"
      >
        {t("editor.regenerate.site")}
      </button>
    </>
  );
}
