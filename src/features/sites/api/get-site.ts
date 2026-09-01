import { getSiteForOwner, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import type { SiteDTO } from "@/features/sites/types";

export type GetSiteResult = { ok: true; site: SiteDTO } | { ok: false; error: "unauthorized" | "not_found" };

export async function getSiteForCurrentUser(siteId: string): Promise<GetSiteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };
  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };
  return { ok: true, site: toSiteDTO(site) };
}