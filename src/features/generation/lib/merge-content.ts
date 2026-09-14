import type { SiteBusinessInfo, ContentField } from "@/features/sites/types";
import type { FieldResult } from "./field-validation";

function isTestimonialField(key: string): boolean {
  return key.startsWith("testimonial_");
}

function isProseField(key: string): boolean {
  // Fields that can be flagged for blank supporting inputs per the task spec:
  // - hero_*: flagged when description blank
  // - about_*: flagged when description/targetCustomers blank
  // - services_title: flagged when description blank
  // - service_N_*: flagged when description+services blank
  // - contact_body, footer_text: flagged when location blank
  // CTA and nav fields are NOT flagged for blank inputs.
  if (key.startsWith("hero_")) return true;
  if (key.startsWith("about_")) return true;
  if (key === "services_title") return true;
  if (key.startsWith("service_")) return true;
  if (key === "contact_body" || key === "footer_text") return true;
  return false;
}

function shouldFlag(
  key: string,
  outcome: FieldResult["outcome"],
  businessInfo: SiteBusinessInfo
): boolean {
  // Testimonial fields are always flagged (samples by definition)
  if (isTestimonialField(key)) return true;

  // Fallback fields are always flagged
  if (outcome === "fallback") return true;

  // For AI-generated fields, flag if the supporting input was blank
  // Mapping per the task:
  // - description blank → flag all hero/about/services prose fields
  // - services blank → flag service_N_* fields
  // - targetCustomers blank → flag about_body
  // - location blank → flag contact_body/footer_text
  if (!isProseField(key)) return false;

  const desc = (businessInfo.description ?? "").trim();
  const services = (businessInfo.services ?? "").trim();
  const targetCustomers = (businessInfo.targetCustomers ?? "").trim();
  const location = (businessInfo.location ?? "").trim();

  if (
    desc === "" &&
    (key.startsWith("hero_") || key.startsWith("about_") || key === "services_title" || key.startsWith("service_"))
  ) {
    return true;
  }
  if (services === "" && key.startsWith("service_")) {
    return true;
  }
  if (targetCustomers === "" && key === "about_body") {
    return true;
  }
  if (location === "" && (key === "contact_body" || key === "footer_text")) {
    return true;
  }
  return false;
}

export function mergeGeneratedContent(
  results: FieldResult[],
  businessInfo: SiteBusinessInfo
): Record<string, ContentField> {
  const out: Record<string, ContentField> = {};
  for (const r of results) {
    const origin: ContentField["origin"] = r.outcome === "fallback" ? "placeholder" : "ai";
    const reviewFlagged = shouldFlag(r.key, r.outcome, businessInfo);
    out[r.key] = {
      value: r.value,
      origin,
      edited: false,
      reviewFlagged,
    };
  }
  return out;
}

export function mergePageContent(
  existing: Record<string, ContentField>,
  generated: Record<string, ContentField>,
  force = false
): Record<string, ContentField> {
  const out: Record<string, ContentField> = { ...existing };
  for (const [key, field] of Object.entries(generated)) {
    const prev = existing[key];
    if (prev?.edited && !force) {
      out[key] = prev;
      continue;
    }
    out[key] = field;
  }
  return out;
}