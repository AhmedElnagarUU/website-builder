import { z } from "zod";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { isImageKeyForSite } from "../lib/s3";
import { slotExistsInTemplate } from "./request-image-upload";
import type { SiteDTO } from "@/features/sites/types";

const POSITION9 = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
] as const;

export const recordImageSlotSchema = z
  .object({
    slotId: z.string().min(1),
    s3Key: z.string().min(1),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    position: z.enum(POSITION9).optional(),
  })
  .strip();

export type RecordImageSlotResult =
  | { ok: true; site: SiteDTO }
  | { ok: false; error: "unauthorized" | "not_found" | "unknown_slot" | "invalid_key" };

export async function recordImageSlot(
  siteId: string,
  rawBody: unknown
): Promise<RecordImageSlotResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = recordImageSlotSchema.safeParse(rawBody);
  if (!parsed.success) return { ok: false, error: "invalid_key" };
  const { slotId, s3Key, width, height, position } = parsed.data;

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return { ok: false, error: "not_found" };

  if (!slotExistsInTemplate(template, slotId)) return { ok: false, error: "unknown_slot" };
  if (!isImageKeyForSite(siteId, s3Key)) return { ok: false, error: "invalid_key" };

  const nextImages = { ...site.images };
  nextImages[slotId] = {
    s3Key,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(position ? { position } : {}),
  };

  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, { images: nextImages, hasUnpublishedChanges });
  if (!updated) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(updated) };
}
