import { getSiteForOwner, updateSite } from "@/features/sites/repository";

export type StartGenerationResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | "unauthorized"
        | "not_found"
        | "missing_required_info"
        | "no_template"
        | "no_languages"
        | "generation_running";
    };

export async function startGeneration(siteId: string): Promise<StartGenerationResult> {
  const { getSession } = await import("@/features/auth/lib/session");
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  if (!site.businessInfo.name || !site.businessInfo.category) {
    return { ok: false, error: "missing_required_info" };
  }
  if (!site.templateId) {
    return { ok: false, error: "no_template" };
  }
  if (!site.activeLanguages || site.activeLanguages.length === 0) {
    return { ok: false, error: "no_languages" };
  }
  if (site.generation.status === "queued" || site.generation.status === "running") {
    return { ok: false, error: "generation_running" };
  }

  // Flip to queued
  await updateSite(siteId, {
    generation: { status: "queued", startedAt: new Date() },
  });

  // Immediately flip to running and start the job
  await updateSite(siteId, {
    generation: { status: "running", startedAt: new Date() },
  });

  // Detached execution
  const { runGeneration } = await import("../run-generation");
  void runGeneration(siteId).catch((e) => {
    console.error("runGeneration uncaught error:", e);
  });

  return { ok: true };
}