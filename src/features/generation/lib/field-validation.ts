import type { TemplateField, TemplateSection } from "@/features/templates/types";
import type { Locale } from "@/features/sites/types";
import type { ParsedFields } from "../types";
import { buildPlaceholder, kindForFieldKey } from "./placeholders";

export type FieldOutcome = "ok" | "retried-shorter" | "fallback";

export interface FieldResult {
  key: string;
  value: string;
  outcome: FieldOutcome;
}

export interface ValidationContext {
  businessName: string;
  locale: Locale;
  aiConfig: { baseUrl: string; apiKey: string; model: string };
  retry: (field: TemplateField, locale: Locale, businessName: string) => Promise<string>;
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function passesConstraint(field: TemplateField, value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (field.constraint.maxWords !== undefined) {
    if (countWords(trimmed) > field.constraint.maxWords) return false;
  }
  if (field.constraint.maxChars !== undefined) {
    if (trimmed.length > field.constraint.maxChars) return false;
  }
  return true;
}

export function describeLimit(field: TemplateField): string {
  if (field.constraint.maxWords !== undefined) return `${field.constraint.maxWords} words`;
  if (field.constraint.maxChars !== undefined) return `${field.constraint.maxChars} characters`;
  return "any length";
}

export async function validateAndSanitize(
  fields: ParsedFields,
  sections: TemplateSection[],
  ctx: ValidationContext
): Promise<FieldResult[]> {
  const results: FieldResult[] = [];

  for (const section of sections) {
    for (const fieldDef of section.fields) {
      const raw = fields[fieldDef.key];
      const value = typeof raw === "string" ? raw.trim() : "";

      if (value.length > 0 && passesConstraint(fieldDef, value)) {
        results.push({ key: fieldDef.key, value, outcome: "ok" });
        continue;
      }

      // Try one shorter retry
      const retried = await ctx.retry(fieldDef, ctx.locale, ctx.businessName).catch(() => "");
      if (retried.trim().length > 0 && passesConstraint(fieldDef, retried)) {
        results.push({ key: fieldDef.key, value: retried.trim(), outcome: "retried-shorter" });
        continue;
      }

      // Fallback to placeholder
      const kind = kindForFieldKey(fieldDef.key);
      const placeholder = buildPlaceholder(kind, ctx.locale, ctx.businessName);
      results.push({ key: fieldDef.key, value: placeholder, outcome: "fallback" });
    }
  }

  return results;
}