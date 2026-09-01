"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { PublishedSnapshot } from "@/features/sites/types";

interface PublishControlProps {
  siteId: string;
  canPublish: boolean;
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
  onPublished?: () => void;
}

export function PublishControl({
  siteId,
  canPublish,
  publishedSnapshot,
  hasUnpublishedChanges,
  onPublished,
}: PublishControlProps) {
  const t = useTranslations();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [working, setWorking] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(hasUnpublishedChanges);

  useEffect(() => {
    if (hasUnpublishedChanges) setDirty(true);
  }, [hasUnpublishedChanges]);

  const isRepublish = dirty && publishedSnapshot !== null;
  const showDrift =
    dirty && publishedSnapshot !== null;
  const confirmText = isRepublish ? t("publish.republish_confirm") : t("publish.confirm");
  const confirmButtonLabel = isRepublish
    ? t("publish.republish_btn")
    : t("publish.confirm_btn");

  const confirm = async () => {
    setShowConfirm(false);
    setWorking(true);
    setError(null);
    try {
      const res = await fetch(`/api/sites/${siteId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.liveUrl) {
        setLiveUrl(String(data.liveUrl));
        setDirty(false);
        onPublished?.();
        router.refresh();
      } else {
        setError(t("common.error.generic"));
      }
    } catch {
      setError(t("common.error.generic"));
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="vexa-surface w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-start text-sm text-ink">{confirmText}</p>
            {error && (
              <p role="alert" className="mb-4 text-sm font-medium text-vexa-red">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded border border-input px-3 py-2 text-sm"
              >
                {t("publish.cancel")}
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={working}
                className="rounded bg-ink px-3 py-2 text-sm text-paper"
              >
                {working ? t("common.loading") : confirmButtonLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && !showConfirm && (
        <span role="alert" className="text-xs font-medium text-vexa-red">
          {error}
        </span>
      )}

      {showDrift && (
        <span className="rounded-full border border-ink/30 bg-paper-2 px-3 py-1 text-xs font-medium text-ink">
          {t("publish.unpublished_changes")}
        </span>
      )}

      {liveUrl && (
        <span className="flex items-center gap-2 text-xs font-medium text-vexa-green">
          {t("publish.success")}
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {t("publish.open_live")}
          </a>
        </span>
      )}

      {canPublish ? (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setShowConfirm(true);
          }}
          disabled={working}
          className="rounded-[4px] bg-ink px-3 py-1.5 text-sm font-semibold text-paper"
        >
          {working ? t("common.loading") : isRepublish ? t("publish.republish_btn") : t("publish.action")}
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-[4px] bg-ink/40 px-3 py-1.5 text-sm font-semibold text-paper"
          title={t("publish.unpublishable_hint")}
        >
          {t("publish.action")}
        </button>
      )}
    </>
  );
}
