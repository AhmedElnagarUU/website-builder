import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, deleteSite } from "@/features/sites/repository";
import { createS3Client, isImageKeyForSite, S3_BUCKET } from "@/features/images/lib/s3";
import { deleteSitePageviews } from "@/features/analytics/repository";

export type DeleteSiteResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" };

async function deleteSiteImages(siteId: string, s3Keys: string[]): Promise<void> {
  const s3 = createS3Client();
  for (const key of s3Keys) {
    if (!isImageKeyForSite(siteId, key)) continue;
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    } catch (error) {
      console.error(`Failed to delete S3 object ${key}:`, error);
    }
  }
}

export async function deleteSiteForCurrentUser(
  siteId: string
): Promise<DeleteSiteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const s3Keys = Object.values(site.images).map((image) => image.s3Key);
  await deleteSiteImages(siteId, s3Keys);
  await deleteSitePageviews(siteId);

  const deleted = await deleteSite(siteId);
  if (!deleted) return { ok: false, error: "not_found" };

  return { ok: true };
}