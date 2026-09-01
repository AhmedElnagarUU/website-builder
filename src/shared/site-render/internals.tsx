"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useSiteEditMode, useSiteBrand } from "./context";
import { positionToCss } from "./tokens";
import type { ContentField, SiteImage } from "@/features/sites/types";

export function F({
  fieldKey,
  content,
  className = "",
  as: Tag = "span",
}: {
  fieldKey: string;
  content: Record<string, ContentField>;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const t = useTranslations();
  const edit = useSiteEditMode();
  const brand = useSiteBrand();
  const field = content[fieldKey];

  if (edit.enabled && edit.editingFieldKey === fieldKey && edit.renderInlineEditor) {
    return <>{edit.renderInlineEditor(fieldKey)}</>;
  }

  if (edit.enabled && (!field || !field.value)) {
    return (
      <button
        type="button"
        onClick={() => edit.onRequestEdit(fieldKey)}
        className="block w-full rounded border border-dashed px-2 py-1 text-start text-sm text-muted-foreground"
        style={{ borderColor: brand.brandColor }}
      >
        {t("render.empty_field_hint")}
      </button>
    );
  }

  const value = field?.value ?? "";
  const flagged = !!field?.reviewFlagged;

  if (edit.enabled) {
    return (
      <button
        type="button"
        onClick={() => edit.onRequestEdit(fieldKey)}
        className="group relative inline-block rounded px-0.5 text-start hover:opacity-80"
      >
        <Tag className={className}>{value}</Tag>
        {flagged && (
          <span
            className="absolute start-0 -top-3 z-10 rounded-sm px-1 text-[0.6rem] font-medium"
            style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
          >
            {t("render.review_flag")}
          </span>
        )}
      </button>
    );
  }

  return <Tag className={className}>{value}</Tag>;
}

export function SlotImage({
  slotId,
  image,
  defaultAsset,
  className = "",
  alt = "",
}: {
  slotId: string;
  image?: SiteImage;
  defaultAsset: string;
  className?: string;
  alt?: string;
}) {
  const t = useTranslations();
  const edit = useSiteEditMode();
  const brand = useSiteBrand();
  const src = image?.s3Key
    ? edit.s3PublicBaseUrl
      ? `${edit.s3PublicBaseUrl}/${image.s3Key}`
      : `s3://${image.s3Key}`
    : defaultAsset;

  if (edit.enabled && !image) {
    return (
      <button
        type="button"
        onClick={() => edit.onRequestEdit(slotId)}
        className="flex w-full items-center justify-center rounded border border-dashed text-sm text-muted-foreground"
        style={{ borderColor: brand.brandColor }}
      >
        {t("render.empty_field_hint")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => edit.enabled && edit.onRequestEdit(slotId)}
      className={`block ${className}`}
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: positionToCss(image?.position) }}
      />
    </button>
  );
}

export function SampleTag({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const edit = useSiteEditMode();
  if (!edit.enabled) return <>{children}</>;
  return (
    <div className="relative">
      {children}
      <span className="absolute -top-2 end-2 rounded-sm bg-muted px-1 text-[0.6rem] text-muted-foreground">
        {t("render.sample_tag")}
      </span>
    </div>
  );
}
