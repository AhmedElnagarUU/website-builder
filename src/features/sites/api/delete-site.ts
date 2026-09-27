import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, deleteSite } from "@/features/sites/repository";
import { createS3Client, isImageKeyForSite, S3_BUCKET } from "@/features/images/lib/s3";
import { deleteSitePageviews } from "@/features/analytics/repository";

const DELETE_BATCH_SIZE = 1000;

export type DeleteSiteResult =
  | { ok: true; imagesFailed: number }
  | { ok: false; error: "unauthorized" | "not_found" };

async function deleteSiteImages(
  siteId: string,
  s3Keys: string[]
): Promise<{ failed: number }> {
  const keys = s3Keys.filter((key) => isImageKeyForSite(siteId, key));
  if (keys.length === 0) return { failed: 0 };

  const s3 = createS3Client();
  let failed = 0;

  for (let start = 0; start < keys.length; start += DELETE_BATCH_SIZE) {
    const batch = keys.slice(start, start + DELETE_BATCH_SIZE);

    try {
      const res = await s3.send(
        new DeleteObjectsCommand({
          Bucket: S3_BUCKET,
          Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: false },
        })
      );
      for (const item of res.Errors ?? []) {
        console.error(`Failed to delete S3 object ${item.Key}: ${item.Code} ${item.Message}`);
      }
      failed += res.Errors?.length ?? 0;
    } catch (error) {
      console.error(`Failed to delete ${batch.length} S3 object(s) for site ${siteId}:`, error);
      failed += batch.length;
    }
  }

  return { failed };
}

export async function deleteSiteForCurrentUser(
  siteId: string
): Promise<DeleteSiteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const s3Keys = Object.values(site.images).map((image) => image.s3Key);
  const { failed } = await deleteSiteImages(siteId, s3Keys);
  await deleteSitePageviews(siteId);

  const deleted = await deleteSite(siteId);
  if (!deleted) return { ok: false, error: "not_found" };

  return { ok: true, imagesFailed: failed };
}
