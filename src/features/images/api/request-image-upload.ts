import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { S3_BUCKET, createS3Client, buildImageKey } from "../lib/s3";
import { MIME_EXT } from "@/shared/lib/image-upload";

const imageUploadSchema = z
  .object({
    slotId: z.string().min(1),
    mimeType: z.string().min(1),
    fileSize: z.number().int().positive().optional(),
  })
  .strip();

export type RequestImageUploadResult =
  | { ok: true; uploadUrl: string; s3Key: string }
  | { ok: false; error: "unauthorized" | "not_found" | "unknown_slot" | "unsupported_format" | "config_error" };

export function slotExistsInTemplate(
  template: { pages: { sections: { images?: { slotId: string }[] }[] }[] },
  slotId: string
): boolean {
  return template.pages.some((page) =>
    page.sections.some((s) => (s.images ?? []).some((img) => img.slotId === slotId))
  );
}

export async function requestImageUpload(
  siteId: string,
  rawBody: unknown
): Promise<RequestImageUploadResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = imageUploadSchema.safeParse(rawBody);
  if (!parsed.success) return { ok: false, error: "unknown_slot" };
  const { slotId, mimeType } = parsed.data;

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return { ok: false, error: "not_found" };

  if (!slotExistsInTemplate(template, slotId)) return { ok: false, error: "unknown_slot" };
  if (!(mimeType in MIME_EXT)) return { ok: false, error: "unsupported_format" };

  const s3Key = buildImageKey(siteId, slotId, mimeType);
  let uploadUrl: string;
  try {
    const client = createS3Client();
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      ContentType: mimeType,
    });
    uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
  } catch {
    return { ok: false, error: "config_error" };
  }

  return { ok: true, uploadUrl, s3Key };
}
