"use client";

import { MIME_EXT, MAX_IMAGE_BYTES } from "@/shared/lib/image-upload";
import type { SiteImage } from "@/features/sites/types";
import type { PaywallInfo } from "@/features/monetization/lib/paywall-client";

export type ImageFileError = "unsupported" | "too_large";

export type UploadErrorKind =
  | "unsupported"
  | "too_large"
  | "limit_reached"
  | "requires_upgrade"
  | "account_frozen"
  | "account_suspended"
  | "trial_expired"
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
  readonly paywall?: PaywallInfo;
  constructor(kind: UploadErrorKind, paywall?: PaywallInfo) {
    super(kind);
    this.kind = kind;
    this.paywall = paywall;
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
  if (status === 401) return "unauthorized";
  if (status === 403) {
    if (body?.error === "account_frozen") return "account_frozen";
    if (body?.error === "account_suspended") return "account_suspended";
    return "unauthorized";
  }
  if (status === 402) {
    if (body?.error === "trial_expired") return "trial_expired";
    if (body?.error === "requires_upgrade") return "requires_upgrade";
    return "limit_reached";
  }
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

function paywallFromBody(
  status: number,
  body: { error?: string; plan?: string; limitKey?: string } | null
): PaywallInfo | null {
  if (status !== 402 && status !== 403) return null;
  if (!body?.error) return null;
  if (
    body.error !== "limit_reached" &&
    body.error !== "requires_upgrade" &&
    body.error !== "account_frozen" &&
    body.error !== "account_suspended" &&
    body.error !== "trial_expired"
  ) {
    return null;
  }
  return {
    reason: body.error,
    plan: body.plan === "pro" ? "pro" : "free",
    limitKey: typeof body.limitKey === "string" ? body.limitKey : "",
  };
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
      body: JSON.stringify({ slotId, mimeType: mime, fileSize: file.size }),
    });
    const body = (await res.json().catch(() => null)) as
      | { uploadUrl?: string; s3Key?: string; error?: string; plan?: string; limitKey?: string }
      | null;
    if (!res.ok || !body?.uploadUrl || !body?.s3Key) {
      const paywall = paywallFromBody(res.status, body);
      throw new UploadFlowError(mapApiError(res.status, body), paywall ?? undefined);
    }
    ticket = { uploadUrl: body.uploadUrl, s3Key: body.s3Key };
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
