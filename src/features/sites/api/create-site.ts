import { createSite, toSiteDTO } from "@/features/sites/repository";
import { getSession } from "@/features/auth/lib/session";
import type { SiteDTO } from "@/features/sites/types";

export type CreateSiteResult = { ok: true; site: SiteDTO } | { ok: false; error: "unauthorized" };

export async function createSiteForCurrentUser(): Promise<CreateSiteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };
  const site = await createSite({ ownerId: session.user.id });
  return { ok: true, site: toSiteDTO(site) };
}