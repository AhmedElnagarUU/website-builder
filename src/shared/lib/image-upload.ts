export const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const ACCEPTED_MIMES: string[] = Object.keys(MIME_EXT);

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
