import { presignImageUrl } from "./s3";
import type { SiteImage } from "@/features/sites/types";

export async function withSignedImageUrls(
  images: Record<string, SiteImage>
): Promise<Record<string, SiteImage>> {
  const entries = await Promise.all(
    Object.entries(images).map(async ([slotId, image]) => {
      if (!image?.s3Key) return [slotId, image] as const;
      const url = await presignImageUrl(image.s3Key);
      return [slotId, url ? { ...image, url } : image] as const;
    })
  );
  return Object.fromEntries(entries);
}
