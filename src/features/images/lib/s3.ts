import { randomUUID } from "node:crypto";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MIME_EXT } from "@/shared/lib/image-upload";

export const S3_BUCKET = process.env.S3_BUCKET;
export const S3_REGION = process.env.S3_REGION;
export const S3_PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL;

export function createS3Client(): S3Client {
  return new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });
}

export function buildImageKey(siteId: string, slotId: string, mimeType: string): string {
  const ext = MIME_EXT[mimeType];
  return `sites/${siteId}/${slotId}/${randomUUID()}.${ext}`;
}

export function isImageKeyForSite(siteId: string, key: string): boolean {
  return key.startsWith(`sites/${siteId}/`);
}

export async function presignImageUrl(key: string, expiresIn = 3600): Promise<string | undefined> {
  if (!S3_BUCKET || !key) return undefined;
  try {
    return await getSignedUrl(
      createS3Client(),
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
      { expiresIn }
    );
  } catch {
    return undefined;
  }
}
