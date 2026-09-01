import { z } from "zod";
import { getSiteForOwner, updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";

const regenerateSectionSchema = z.object({ sectionId: z.string().min(1) }).strip();

export type RegenerateSectionResult =
  | { ok: true }
  | {
      ok: false;
      error: "unauthorized" | "not_found" | "unknown_section" | "generation_running";
    };

export async function regenerateSection(
  siteId: string,
  rawBody: unknown
): Promise<RegenerateSectionResult> {
  const { getSession } = await import("@/features/auth/lib/session");
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = regenerateSectionSchema.safeParse(rawBody);
  if (!parsed.success) return { ok: false, error: "unknown_section" };
  const { sectionId } = parsed.data;

  const template = site.templateId ? getTemplate(site.templateId) : null;
  if (!template) return { ok: false, error: "not_found" };
  if (!template.sections.some((s) => s.id === sectionId)) {
    return { ok: false, error: "unknown_section" };
  }

  if (site.generation.status === "queued" || site.generation.status === "running") {
    return { ok: false, error: "generation_running" };
  }

  await updateSite(siteId, { generation: { status: "queued", startedAt: new Date() } });
  await updateSite(siteId, { generation: { status: "running", startedAt: new Date() } });

  const { runSectionRegeneration } = await import("../run-section-regeneration");
  void runSectionRegeneration(siteId, sectionId).catch((e) => {
    console.error("runSectionRegeneration uncaught error:", e);
  });

  return { ok: true };
}
