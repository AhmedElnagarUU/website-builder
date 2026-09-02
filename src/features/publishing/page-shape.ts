import { getTemplate } from "@/features/templates/api/list-templates";
import type { TemplatePage } from "@/features/templates/types";

export function getTemplatePageIds(templateId: string): string[] {
  const template = getTemplate(templateId);
  if (!template) return ["home"];
  return template.pages.map((p) => p.id);
}

export function getTemplatePages(templateId: string): TemplatePage[] {
  const template = getTemplate(templateId);
  if (!template) return [];
  return template.pages;
}

export function normalizeSnapshotPageIds(
  templateId: string,
  contentPageIds: string[]
): string[] {
  const templatePageIds = getTemplatePageIds(templateId);
  const present = new Set(contentPageIds);
  const ids = templatePageIds.filter((id) => present.has(id));
  if (!ids.includes("home")) ids.unshift("home");
  return ids;
}
