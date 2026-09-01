import type { GenerationMessages, GenerationRequest } from "../types";
import type { TemplateField } from "@/features/templates/types";

const SYSTEM_PROMPT = `You are a professional website copywriter for small businesses.
You write copy for ONE language version of a website, following these absolute rules:

1. Write natively for the target audience. If the target language is Arabic, write natural,
   culturally appropriate Arabic for an Arabic-speaking audience (greetings, framing, tone) —
   never a literal translation of English phrasing. Facts must stay identical across languages.
2. NEVER invent checkable facts: no years in business, no prices, no awards, no certifications,
   no client counts, no named clients — unless explicitly provided in the business information.
   Prefer generic qualitative statements ("experienced local team").
3. Testimonials you write are clearly SAMPLE content: generic first names only, realistic but
   obviously illustrative quotes.
4. Respect every field's length constraint exactly.
5. Use plain, warm, concrete business language. No marketing jargon, no design terminology.

You will receive: business information (some fields may be empty — write plausible, generic
content appropriate to the stated business category for those), and a list of fields with
id, purpose, and constraints.
Return ONLY valid JSON, exactly:
{ "fields": { "<fieldId>": "<text>", ... } }
Every field id MUST be present exactly once.
Do NOT include any prose, explanation, or markdown formatting. Output must be parseable as JSON.`;

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  ar: "Arabic",
};

function describeConstraint(field: TemplateField): string {
  const parts: string[] = [];
  if (field.constraint.maxWords !== undefined) parts.push(`maxWords=${field.constraint.maxWords}`);
  if (field.constraint.maxChars !== undefined) parts.push(`maxChars=${field.constraint.maxChars}`);
  return parts.join(", ");
}

export function buildGenerationMessages(
  req: GenerationRequest
): GenerationMessages {
  const b = req.businessInfo;
  const lines: string[] = [
    `Business name: ${b.name || "(not provided)"}`,
    `Business category: ${b.category || "(not provided)"}`,
    `What the business does: ${b.description || "(not provided)"}`,
    `Target customers: ${b.targetCustomers || "(not provided)"}`,
    `Services or products: ${b.services || "(not provided)"}`,
    `Location: ${b.location || "(not provided)"}`,
    `Phone: ${b.contactPhone || "(not provided)"}`,
    `Email: ${b.contactEmail || "(not provided)"}`,
    `USPs / what makes them different: ${(b.usps ?? []).join("; ") || "(not provided)"}`,
    `Notes: ${(b.notes ?? []).join("; ") || "(not provided)"}`,
  ];

  const fieldRows: string[] = req.template.sections.flatMap((section) =>
    section.fields.map(
      (f) => `| ${f.key} | ${f.purpose} | ${describeConstraint(f)} |`
    )
  );

  const otherValuesBlock = req.otherSectionValues
    ? `\nOther section values already written (for tone/fact consistency):\n${Object.entries(
        req.otherSectionValues
      )
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}\n`
    : "";

  const user = `Target locale: ${req.locale} (${LOCALE_NAMES[req.locale] ?? req.locale})

Business information:
${lines.join("\n")}
${otherValuesBlock}
Fields to generate (key | purpose | constraint):
${fieldRows.join("\n")}

Return ONLY the JSON object described in the system prompt. No prose, no markdown.`;

  return { system: SYSTEM_PROMPT, user };
}