"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { uploadImage, validateImageFile } from "../lib/uploadImage";
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

type ModalError = "unsupported" | "too_large" | "upload_error";

export function ImageSlotEditor({
  slot,
  siteId,
  current,
  onClose,
  onChanged,
}: {
  slot: ImageSlot;
  siteId: string;
  current?: SiteImage;
  onClose: () => void;
  onChanged: (image: SiteImage) => void;
}) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ModalError | null>(null);
  const [uploading, setUploading] = useState(false);

  const lowRes = Boolean(
    current &&
      ((current.width !== undefined && current.width < slot.minWidth) ||
        (current.height !== undefined && current.height < slot.minHeight))
  );

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const checked = validateImageFile(file);
    if ("error" in checked) {
      setError(checked.error);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const image = await uploadImage(siteId, slot.slotId, file);
      onChanged(image);
      onClose();
    } catch {
      setError("upload_error");
    } finally {
      setUploading(false);
    }
  };

  const setPosition = async (position: Position9) => {
    if (!current) return;
    setError(null);
    try {
      const res = await fetch(`/api/sites/${siteId}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: slot.slotId, s3Key: current.s3Key, position }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.images?.[slot.slotId]) {
        setError("upload_error");
        return;
      }
      onChanged(body.images[slot.slotId] as SiteImage);
    } catch {
      setError("upload_error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded border border-input bg-background p-4 shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-start text-sm font-medium">
          {current ? t("editor.image.replace") : t("editor.image.upload")}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded border border-input bg-muted px-3 py-2 text-sm"
        >
          {uploading ? t("editor.image.uploading") : (current ? t("editor.image.replace") : t("editor.image.upload"))}
        </button>

        {error === "unsupported" && (
          <p className="mt-2 text-start text-xs text-red-600" role="alert">
            {t("editor.image.unsupported")}
          </p>
        )}
        {error === "too_large" && (
          <p className="mt-2 text-start text-xs text-red-600" role="alert">
            {t("editor.image.too_large")}
          </p>
        )}
        {error === "upload_error" && (
          <p className="mt-2 text-start text-xs text-red-600" role="alert">
            {t("editor.image.upload_error")}
          </p>
        )}
        {lowRes && (
          <p className="mt-2 text-start text-xs text-amber-600">
            {t("editor.image.low_res")}
          </p>
        )}

        {current && (
          <div className="mt-4 text-start">
            <div className="mb-1 text-xs text-muted-foreground">
              {t("editor.image.reposition")}
            </div>
            <div className="grid w-24 grid-cols-3 gap-1">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  type="button"
                  aria-label={pos}
                  onClick={() => setPosition(pos)}
                  className={`aspect-square rounded border ${
                    current.position === pos
                      ? "border-primary bg-primary/10"
                      : "border-input"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
