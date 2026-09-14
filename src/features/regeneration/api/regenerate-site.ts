import { getSiteForOwner, updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { countEditedFields } from "./regenerate-impact";

export type RegenerateSiteResult =
  | { ok: true }
  | {
      ok: false;
      error: "unauthorized" | "not_found" | "generation_running" | "confirmation_required";
      userEditedCount?: number;
    };

export async function regenerateSite(
  siteId: string,
  rawBody: unknown
): Promise<RegenerateSiteResult> {
  const { getSession } = await import("@/features/auth/lib/session");
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return { ok: false, error: "not_found" };

  if (site.generation.status === "queued" || site.generation.status === "running") {
    return { ok: false, error: "generation_running" };
  }

  const userEditedCount = countEditedFields(site);
  const confirmed = (rawBody as { confirm?: unknown } | null)?.confirm === true;
  if (userEditedCount > 0 && !confirmed) {
    return { ok: false, error: "confirmation_required", userEditedCount };
  }

  await updateSite(siteId, { generation: { status: "queued", startedAt: new Date() } });
  await updateSite(siteId, { generation: { status: "running", startedAt: new Date() } });

  const { runSiteRegeneration } = await import("../run-site-regeneration");
  void runSiteRegeneration(siteId, undefined, confirmed).catch((e) => {
    console.error("runSiteRegeneration uncaught error:", e);
  });

  return { ok: true };
}
