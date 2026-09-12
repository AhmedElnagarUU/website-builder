"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/Input";

export function DeleteSiteButton({
  siteId,
  siteName,
}: {
  siteId: string;
  siteName: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmEnabled = typed === siteName && !working;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function confirmDelete() {
    setWorking(true);
    setError(null);
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        setError(t("delete.error"));
      }
    } catch {
      setError(t("delete.error"));
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("dashboard.delete_site")}
        className="mono-display absolute bottom-3 end-3 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm leading-none text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {t("dashboard.delete_site")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="mono-surface w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mono-display text-2xl font-bold text-ink">
              {t("delete.dialog_title")}
            </h2>
            <p className="font-serif2 mt-2 text-sm leading-relaxed text-ink-2">
              {t.rich("delete.dialog_body", {
                siteName: (chunks) => (
                  <strong className="text-ink">{chunks}</strong>
                ),
              })}
            </p>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={t("delete.dialog_placeholder")}
              className="mt-4"
              disabled={working}
            />
            {error && (
              <p role="alert" className="mt-3 text-sm font-medium text-mono-red">
                {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={working}
                className="rounded border border-input px-3 py-2 text-sm text-ink"
              >
                {t("delete.cancel")}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!confirmEnabled}
                className="rounded bg-mono-red px-3 py-2 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-50"
              >
                {working ? t("common.loading") : t("delete.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}