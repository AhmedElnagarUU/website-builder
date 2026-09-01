import type { SectionType } from "@/features/templates/types";
import type { Locale } from "@/features/sites/types";

export type PlaceholderKind =
  | "hero_headline"
  | "hero_subline"
  | "body"
  | "title"
  | "cta_button_label"
  | "contact_body"
  | "footer_text"
  | "testimonial_quote"
  | "testimonial_author"
  | "nav";

const PLACEHOLDERS: Record<PlaceholderKind, Record<Locale, string>> = {
  hero_headline: {
    en: "Welcome to {businessName}",
    ar: "أهلاً بك في {businessName}",
  },
  hero_subline: {
    en: "Tell your customers about this here.",
    ar: "أخبر عملاءك عن هذا هنا.",
  },
  body: {
    en: "Tell your customers about this here.",
    ar: "أخبر عملاءك عن هذا هنا.",
  },
  title: {
    en: "About this",
    ar: "عن هذا",
  },
  cta_button_label: {
    en: "Contact us",
    ar: "تواصل معنا",
  },
  contact_body: {
    en: "Tell your customers about this here.",
    ar: "أخبر عملاءك عن هذا هنا.",
  },
  footer_text: {
    en: "© {businessName}",
    ar: "© {businessName}",
  },
  testimonial_quote: {
    en: "Sample quote — replace with real feedback.",
    ar: "اقتباس نموذجي — استبدله برأي حقيقي.",
  },
  testimonial_author: {
    en: "A satisfied customer",
    ar: "عميل راضٍ",
  },
  nav: {
    en: "Home",
    ar: "الرئيسية",
  },
};

export function kindForFieldKey(key: string): PlaceholderKind {
  if (key === "hero_headline") return "hero_headline";
  if (key === "hero_subline") return "hero_subline";
  if (key === "cta_button_label") return "cta_button_label";
  if (key === "contact_body") return "contact_body";
  if (key === "footer_text") return "footer_text";
  if (key.startsWith("testimonial_") && key.endsWith("_quote")) return "testimonial_quote";
  if (key.startsWith("testimonial_") && key.endsWith("_author")) return "testimonial_author";
  if (key.startsWith("nav_")) return "nav";
  if (key === "services_title" || key === "about_title" || key === "contact_heading") return "title";
  return "body";
}

export function sectionTypeForFieldKey(
  key: string,
  sectionTypes: Map<string, SectionType>
): SectionType | null {
  // Find which section a field belongs to by searching
  for (const [sectionKey, sectionType] of sectionTypes.entries()) {
    if (key.startsWith(`${sectionKey}.`) || key === sectionKey) return sectionType;
  }
  // Fallback: determine from key prefix
  if (key.startsWith("hero_")) return "hero";
  if (key.startsWith("service_") || key === "services_title") return "services";
  if (key.startsWith("about_")) return "about";
  if (key.startsWith("testimonial_")) return "testimonials";
  if (key.startsWith("cta_")) return "cta";
  if (key.startsWith("contact_")) return "contact";
  if (key.startsWith("nav_")) return "header";
  if (key.startsWith("footer_")) return "footer";
  return null;
}

export function buildPlaceholder(
  kind: PlaceholderKind,
  locale: Locale,
  businessName: string
): string {
  const template = PLACEHOLDERS[kind][locale];
  return template.replace(/\{businessName\}/g, businessName);
}