import { randomUUID } from "node:crypto";
import { S3Client } from "@aws-sdk/client-s3";
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
