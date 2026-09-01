import { TEMPLATES } from "@/features/templates/catalog";
import { CATEGORY_IDS } from "@/features/sites/schemas";
import type { TemplateDefinition } from "@/features/templates/types";
import type { CategoryId } from "@/features/sites/types";

export interface ListTemplatesResult {
  ok: true;
  data: TemplateDefinition[];
}

export interface RankedTemplatesResult {
  ok: true;
  data: { suggested: TemplateDefinition[]; others: TemplateDefinition[] };
}

export function listTemplates(): ListTemplatesResult {
  return { ok: true, data: TEMPLATES };
}

export function rankTemplatesByCategory(
  category: string | null | undefined
): RankedTemplatesResult {
  const isValid = category !== null && category !== undefined && (CATEGORY_IDS as readonly string[]).includes(category);
  if (!isValid) {
    return { ok: true, data: { suggested: [], others: TEMPLATES } };
  }
  const cat = category as CategoryId;
  const suggested: TemplateDefinition[] = [];
  const others: TemplateDefinition[] = [];
  for (const t of TEMPLATES) {
    if (t.categories.includes(cat)) suggested.push(t);
    else others.push(t);
  }
  return { ok: true, data: { suggested, others } };
}

export function getTemplate(id: string): TemplateDefinition | null {
  return TEMPLATES.find((t) => t.id === id) ?? null;
}