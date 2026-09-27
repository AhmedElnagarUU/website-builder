"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { uploadImage, validateImageFile, UploadFlowError, type UploadErrorKind } from "../lib/uploadImage";
import { Button } from "@/shared/ui/Button";
import { slotImageSrc } from "@/shared/site-render/internals";
import { usePaywall } from "@/features/monetization/components/paywall-context";
import type { ImageSlot } from "@/features/templates/types";
import type { SiteImage, Position9 } from "@/features/sites/types";

const POSITIONS: Position9[] = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Phase = "pick" | "uploading" | "adjust";

export function ImageSlotEditor({
  slot,
  siteId,
  current,
  onClose,
  onChanged,
  s3PublicBaseUrl,
}: {
  slot: ImageSlot;
  siteId: string;
  current?: SiteImage;
  onClose: () => void;
  onChanged: (image: SiteImage) => void;
  s3PublicBaseUrl?: string;
}) {
  const t = useTranslations();
  const { showPaywall } = usePaywall();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<UploadErrorKind | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<SiteImage | undefined>(current);
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const src = slotImageSrc(uploadedImage, s3PublicBaseUrl, "");
    setResolvedImageUrl(src || undefined);
  }, [s3PublicBaseUrl, uploadedImage]);

  const lowRes = Boolean(
    uploadedImage &&
      ((uploadedImage.width !== undefined && uploadedImage.width < slot.minWidth) ||
        (uploadedImage.height !== undefined && uploadedImage.height < slot.minHeight))
  );

  const startUpload = async (target: File) => {
    setError(null);
    setPendingFile(target);
    setProgress(0);
    setPhase("uploading");
    try {
      const image = await uploadImage(siteId, slot.slotId, target, setProgress);
      onChanged(image);
      onClose();
    } catch (err) {
      setPhase("pick");
      if (err instanceof UploadFlowError && err.paywall) {
        showPaywall(err.paywall);
        return;
      }
      setError(err instanceof Error && "kind" in err ? (err as { kind: UploadErrorKind }).kind : "unknown");
    }
  };

  const acceptFile = (picked?: File) => {
    if (!picked) return;
    const checked = validateImageFile(picked);
    if ("error" in checked) {
      setError(checked.error);
      return;
    }
    void startUpload(picked);
  };

  const setPosition = async (position: Position9) => {
    const target = uploadedImage;
    if (!target) return;
    setError(null);
    try {
      const res = await fetch(`/api/sites/${siteId}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: slot.slotId, s3Key: target.s3Key, position }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.images?.[slot.slotId]) {
        setError("unknown");
        return;
      }
      const next = { ...(body.images[slot.slotId] as SiteImage), url: target.url };
      setUploadedImage(next);
      onChanged(next);
    } catch {
      setError("network");
    }
  };

  const errorMessage = (kind: UploadErrorKind): string => {
    switch (kind) {
      case "unsupported":
        return t("editor.image.unsupported");
      case "too_large":
        return t("editor.image.too_large");
      case "limit_reached":
        return t("paywall.limit_reached");
      case "requires_upgrade":
        return t("paywall.requires_upgrade");
      case "account_frozen":
        return t("paywall.account_frozen");
      case "account_suspended":
        return t("paywall.account_suspended");
      case "trial_expired":
        return t("paywall.trial_expired_body");
      case "unauthorized":
        return t("editor.image.error.unauthorized");
      case "not_found":
        return t("editor.image.error.not_found");
      case "unknown_slot":
        return t("editor.image.error.unknown_slot");
      case "unsupported_format":
        return t("editor.image.error.unsupported_format");
      case "config_error":
        return t("editor.image.error.config_error");
      case "bucket_rejected":
        return t("editor.image.error.bucket_rejected");
      case "network":
        return t("editor.image.error.network");
      default:
        return t("editor.image.upload_error");
    }
  };

  const busy = phase === "uploading";
  const dismiss = () => {
    if (!busy) onClose();
  };
  const selectText = current ? t("editor.image.replace") : t("editor.image.upload");
  const titleText = phase === "adjust" ? t("editor.image.reposition") : selectText;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titleText}
        className="mono-surface flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-[4px] border-2 border-ink bg-paper p-6 shadow-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="mono-display text-lg font-semibold leading-tight text-ink">
            {titleText}
          </h2>
          <button
            type="button"
            onClick={dismiss}
            disabled={busy}
            aria-label={t("editor.image.close")}
            className="-mt-1 -me-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink text-xl leading-none text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
          >
            &times;
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const picked = e.target.files?.[0];
            e.target.value = "";
            acceptFile(picked);
          }}
        />

        {phase === "pick" && (
          <div className="flex flex-col gap-4">
            {current && resolvedImageUrl && (
              <div className="flex flex-col gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvedImageUrl}
                  alt=""
                  className="aspect-[4/3] w-full rounded-[4px] border-[1.5px] border-ink object-cover"
                />
                {lowRes && (
                  <p className="text-xs text-amber-700">{t("editor.image.low_res")}</p>
                )}
              </div>
            )}

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                acceptFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex flex-col items-center gap-3 rounded-[4px] border-2 border-dashed px-4 py-8 text-center transition-colors ${
                dragging ? "border-mono-red bg-mono-red/5" : "border-ink/40"
              }`}
            >
              <p className="mono-display text-base font-semibold text-ink">{selectText}</p>
              <p className="text-xs text-ink-3">{t("editor.image.hint")}</p>
              <Button type="button" onClick={() => inputRef.current?.click()}>
                {selectText}
              </Button>
            </div>

            {current && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setPhase("adjust")}
                >
                  {t("editor.image.reposition")}
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === "uploading" && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm font-medium text-ink">{t("editor.image.uploading")}</p>
            {pendingFile && (
              <p className="font-mono text-xs text-ink-3">
                {pendingFile.name} &middot; {formatBytes(pendingFile.size)}
              </p>
            )}
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 w-full overflow-hidden rounded-full bg-paper-2 ring-1 ring-inset ring-ink/30"
            >
              <div
                className="h-full bg-mono-red transition-[width] duration-200"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
            <p className="font-mono text-xs text-ink-2">{progress}%</p>
          </div>
        )}

        {phase === "adjust" && (
          <div className="flex flex-col gap-4">
            {resolvedImageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={resolvedImageUrl}
                alt=""
                className="aspect-[4/3] w-full rounded-[4px] border-[1.5px] border-ink object-cover"
              />
            )}
            {lowRes && <p className="text-xs text-amber-700">{t("editor.image.low_res")}</p>}

            <div className="text-start">
              <div className="mb-2 text-xs text-ink-3">{t("editor.image.reposition")}</div>
              <div className="grid w-28 grid-cols-3 gap-1.5">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    aria-label={pos}
                    onClick={() => setPosition(pos)}
                    className={`aspect-square rounded-[3px] border-[1.5px] transition-colors ${
                      uploadedImage?.position === pos
                        ? "border-mono-red bg-mono-red/15"
                        : "border-ink/40 hover:border-ink"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={onClose}>
                {t("editor.image.close")}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-[4px] border-[1.5px] border-mono-red/40 bg-mono-red/5 p-3">
            <p role="alert" className="text-start text-sm text-mono-red">
              {errorMessage(error)}
            </p>
            {pendingFile && phase === "pick" && (
              <button
                type="button"
                onClick={() => void startUpload(pendingFile)}
                className="shrink-0 rounded-full border-2 border-ink bg-ink px-3 py-1 text-xs font-semibold text-paper transition-colors hover:border-mono-red hover:bg-mono-red"
              >
                {t("editor.image.retry")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
