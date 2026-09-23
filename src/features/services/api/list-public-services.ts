import { getSiteBySlug } from "@/features/sites/repository";
import { listServicesForSite, toServiceDTO } from "@/features/services/repository";
import type { ServiceDTO } from "@/features/services/types";

export type ListPublicServicesResult =
  | { ok: true; services: ServiceDTO[] }
  | { ok: false; error: "not_found" | "not_live" };

export async function listPublicServices(
  slug: string
): Promise<ListPublicServicesResult> {
  const site = await getSiteBySlug(slug);
  if (!site) return { ok: false, error: "not_found" };
  if (site.status !== "published" || site.publishedSnapshot === null) {
    return { ok: false, error: "not_live" };
  }

  const services = await listServicesForSite(site._id.toString());
  return { ok: true, services: services.map(toServiceDTO) };
}
