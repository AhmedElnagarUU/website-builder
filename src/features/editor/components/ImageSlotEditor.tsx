"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { uploadImage, validateImageFile, UploadFlowError, type UploadErrorKind } from "../lib/uploadImage";
import { Button } from "@/shared/ui/Button";
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

type Phase = "idle" | "uploading" | "done";

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
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<SiteImage | undefined>(current);

  const lowRes = Boolean(
    uploadedImage &&
      ((uploadedImage.width !== undefined && uploadedImage.width < slot.minWidth) ||
        (uploadedImage.height !== undefined && uploadedImage.height < slot.minHeight))
  );

  useEffect(() => {
    const url = previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [previewUrl]);

  const selectText = current ? t("editor.image.replace") : t("editor.image.upload");

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const checked = validateImageFile(picked);
    if ("error" in checked) {
      setError(checked.error);
      return;
    }
    setError(null);
    setPhase("idle");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const runUpload = async () => {
    if (!file) return;
    setError(null);
    setPhase("uploading");
    try {
      const image = await uploadImage(siteId, slot.slotId, file);
      setUploadedImage(image);
      setPhase("done");
      onChanged(image);
    } catch (err) {
      setPhase("idle");
      if (err instanceof UploadFlowError && err.paywall) {
        showPaywall(err.paywall);
        return;
      }
      setError(err instanceof Error && "kind" in err ? (err as { kind: UploadErrorKind }).kind : "unknown");
    }
  };

  const cancelUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    setPhase("idle");
    setError(null);
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
      setUploadedImage(body.images[slot.slotId] as SiteImage);
      onChanged(body.images[slot.slotId] as SiteImage);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="mono-surface w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mono-display mb-4 text-lg font-semibold text-ink">{selectText}</div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={pickFile}
        />

        {phase === "idle" && !previewUrl && (
          <Button
            type="button"
            variant="default"
            className="w-full"
            onClick={() => inputRef.current?.click()}
          >
            {selectText}
          </Button>
        )}

        {previewUrl && phase === "idle" && (
          <div className="flex flex-col gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className="aspect-[4/3] w-full rounded-[4px] border-[1.5px] border-ink object-cover"
            />
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-ink">{file?.name}</span>
              <span className="font-mono text-xs text-ink-3">
                {file ? formatBytes(file.size) : ""}
              </span>
            </div>
            <p className="text-xs text-ink-2">{t("editor.image.ready")}</p>
            <div className="flex gap-2">
              <Button type="button" variant="default" className="flex-1" onClick={cancelUpload}>
                {t("editor.image.cancel")}
              </Button>
              <Button type="button" className="flex-1" onClick={runUpload}>
                {t("editor.image.confirm_upload")}
              </Button>
            </div>
          </div>
        )}

        {phase === "uploading" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div
              aria-hidden
              className="h-8 w-8 animate-spin rounded-full border-2 border-dashed border-mono-red"
            />
            <p className="text-sm text-ink">{t("editor.image.uploading")}</p>
          </div>
        )}

        {phase === "done" && uploadedImage && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-ink">{t("editor.image.done")}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                s3PublicBaseUrl
                  ? `${s3PublicBaseUrl}/${uploadedImage.s3Key}`
                  : undefined
              }
              alt=""
              className="aspect-[4/3] w-full rounded-[4px] border-[1.5px] border-ink object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {lowRes && (
              <p className="text-xs text-amber-700">{t("editor.image.low_res")}</p>
            )}
            <div className="text-start">
              <div className="mb-1 text-xs text-ink-3">{t("editor.image.reposition")}</div>
              <div className="grid w-24 grid-cols-3 gap-1">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    aria-label={pos}
                    onClick={() => setPosition(pos)}
                    className={`aspect-square rounded border-[1.5px] ${
                      uploadedImage.position === pos
                        ? "border-mono-red bg-mono-red/10"
                        : "border-ink/40"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="default" onClick={onClose}>
                {t("editor.template.close")}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start justify-between gap-3 rounded-[4px] border-[1.5px] border-mono-red/40 bg-mono-red/5 p-3">
            <p role="alert" className="text-start text-sm text-mono-red">
              {errorMessage(error)}
            </p>
            {file && phase === "idle" && (
              <button
                type="button"
                onClick={runUpload}
                className="shrink-0 rounded-full border-2 border-ink bg-ink px-3 py-1 text-xs font-semibold text-paper hover:bg-mono-red hover:border-mono-red"
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
