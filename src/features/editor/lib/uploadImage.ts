"use client";

import { MIME_EXT, MAX_IMAGE_BYTES } from "@/shared/lib/image-upload";
import type { SiteImage } from "@/features/sites/types";

export type ImageFileError = "unsupported" | "too_large";

export type UploadErrorKind =
  | "unsupported"
  | "too_large"
  | "unauthorized"
  | "not_found"
  | "unknown_slot"
  | "unsupported_format"
  | "config_error"
  | "bucket_rejected"
  | "network"
  | "unknown";

export class UploadFlowError extends Error {
  readonly kind: UploadErrorKind;
  constructor(kind: UploadErrorKind) {
    super(kind);
    this.kind = kind;
  }
}

export function validateImageFile(
  file: File
): { mime: string } | { error: ImageFileError } {
  const lower = file.type.toLowerCase();
  if (!(lower in MIME_EXT)) return { error: "unsupported" };
  if (file.size > MAX_IMAGE_BYTES) return { error: "too_large" };
  return { mime: lower };
}

function measureImage(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

function mapApiError(status: number, body: { error?: string } | null): UploadErrorKind {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 404) return "not_found";
  switch (body?.error) {
    case "unknown_slot":
      return "unknown_slot";
    case "unsupported_format":
      return "unsupported_format";
    case "config_error":
      return "config_error";
    default:
      return "unknown";
  }
}

export async function uploadImage(
  siteId: string,
  slotId: string,
  file: File
): Promise<SiteImage> {
  const checked = validateImageFile(file);
  if ("error" in checked) throw new UploadFlowError(checked.error);
  const mime = checked.mime;

  let ticket: { uploadUrl: string; s3Key: string };
  try {
    const res = await fetch(`/api/sites/${siteId}/image-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId, mimeType: mime }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.uploadUrl || !body?.s3Key) {
      throw new UploadFlowError(mapApiError(res.status, body));
    }
    ticket = body;
  } catch (e) {
    if (e instanceof UploadFlowError) throw e;
    throw new UploadFlowError("network");
  }

  try {
    const put = await fetch(ticket.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": mime },
    });
    if (!put.ok) throw new UploadFlowError("bucket_rejected");
  } catch (e) {
    if (e instanceof UploadFlowError) throw e;
    throw new UploadFlowError("bucket_rejected");
  }

  let dims: { width?: number; height?: number } = {};
  try {
    dims = await measureImage(URL.createObjectURL(file));
  } catch {
    dims = {};
  }

  try {
    const res = await fetch(`/api/sites/${siteId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId, s3Key: ticket.s3Key, ...dims }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.images?.[slotId]) {
      throw new UploadFlowError(mapApiError(res.status, body));
    }
    return body.images[slotId] as SiteImage;
  } catch (e) {
    if (e instanceof UploadFlowError) throw e;
    throw new UploadFlowError("network");
  }
}
