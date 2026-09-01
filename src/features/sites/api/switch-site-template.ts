import { z } from "zod";
import { getSiteForOwner, updateSite } from "@/features/sites/repository";
import { getTemplate } from "@/features/templates/api/list-templates";
import { hasSiteContent } from "@/features/regeneration/run-template-backfill";

const switchTemplateSchema = z.object({ templateId: z.string().min(1) }).strip();

export type SwitchSiteTemplateResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | "unauthorized"
        | "not_found"
        | "invalid_template"
        | "no_content"
        | "generation_running"
        | "confirmation_required";
    };

export async function switchSiteTemplate(
  siteId: string,
  rawBody: unknown
): Promise<SwitchSiteTemplateResult> {
  const { getSession } = await import("@/features/auth/lib/session");
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const parsed = switchTemplateSchema.safeParse(rawBody);
  if (!parsed.success) return { ok: false, error: "invalid_template" };
  const { templateId } = parsed.data;

  const newTemplate = getTemplate(templateId);
  if (!newTemplate) return { ok: false, error: "invalid_template" };

  if (!hasSiteContent(site)) return { ok: false, error: "no_content" };

  if (site.generation.status === "queued" || site.generation.status === "running") {
    return { ok: false, error: "generation_running" };
  }

  const currentTemplate = site.templateId ? getTemplate(site.templateId) : null;
  let missingCount = 0;
  if (currentTemplate) {
    const currentKeys = new Set(
      currentTemplate.sections.flatMap((s) => s.fields.map((f) => f.key))
    );
    for (const section of newTemplate.sections) {
      for (const field of section.fields) {
        if (field.required && !currentKeys.has(field.key)) missingCount++;
      }
    }
  }

  const confirmed = (rawBody as { confirm?: unknown } | null)?.confirm === true;
  if (missingCount > 0 && !confirmed) {
    return { ok: false, error: "confirmation_required" };
  }

  await updateSite(siteId, { generation: { status: "queued", startedAt: new Date() } });
  await updateSite(siteId, { generation: { status: "running", startedAt: new Date() } });

  const { runTemplateBackfill } = await import("@/features/regeneration/run-template-backfill");
  void runTemplateBackfill(siteId, templateId).catch((e: unknown) => {
    console.error("runTemplateBackfill uncaught error:", e);
  });

  return { ok: true };
}
