"use client";

import { MIME_EXT, MAX_IMAGE_BYTES } from "@/shared/lib/image-upload";
import type { SiteImage } from "@/features/sites/types";

export type ImageFileError = "unsupported" | "too_large";

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

export async function uploadImage(
  siteId: string,
  slotId: string,
  file: File
): Promise<SiteImage> {
  const checked = validateImageFile(file);
  if ("error" in checked) throw new Error(checked.error);
  const mime = checked.mime;

  let ticket: { uploadUrl: string; s3Key: string };
  try {
    const res = await fetch(`/api/sites/${siteId}/image-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId, mimeType: mime }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.uploadUrl || !body?.s3Key) throw new Error("upload_error");
    ticket = body;
  } catch {
    throw new Error("upload_error");
  }

  try {
    const put = await fetch(ticket.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": mime },
    });
    if (!put.ok) throw new Error("upload_error");
  } catch {
    throw new Error("upload_error");
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
    if (!res.ok || !body?.images?.[slotId]) throw new Error("upload_error");
    return body.images[slotId] as SiteImage;
  } catch {
    throw new Error("upload_error");
  }
}
