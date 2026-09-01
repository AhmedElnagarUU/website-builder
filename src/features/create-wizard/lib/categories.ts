import type { Locale } from "@/features/sites/types";

export interface CategoryOption {
  id: "services" | "restaurant" | "retail" | "professional" | "portfolio";
  labels: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
}

export const CATEGORIES: CategoryOption[] = [
  {
    id: "services",
    labels: { en: "Services", ar: "خدمات" },
    keywords: { en: ["services", "service", "salon", "consulting"], ar: ["خدمات", "خدمة", "صالون", "استشارات"] },
  },
  {
    id: "restaurant",
    labels: { en: "Restaurant & Food", ar: "مطاعم وطعام" },
    keywords: { en: ["restaurant", "food", "cafe", "bakery"], ar: ["مطاعم", "طعام", "مقهى", "مخبز"] },
  },
  {
    id: "retail",
    labels: { en: "Retail & Products", ar: "تجارة ومنتجات" },
    keywords: { en: ["retail", "shop", "store", "products"], ar: ["تجارة", "متجر", "منتجات"] },
  },
  {
    id: "professional",
    labels: { en: "Professional & Personal Brand", ar: "مهنيون وعلامة شخصية" },
    keywords: { en: ["professional", "lawyer", "doctor", "brand"], ar: ["مهني", "محامي", "طبيب", "علامة"] },
  },
  {
    id: "portfolio",
    labels: { en: "Portfolio & Creative Work", ar: "أعمال ومشاريع إبداعية" },
    keywords: { en: ["portfolio", "creative", "designer", "artist"], ar: ["أعمال", "إبداعي", "مصمم", "فنان"] },
  },
];

export function filterCategories(query: string, locale: Locale): CategoryOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATEGORIES;
  return CATEGORIES.filter((c) => {
    const label = c.labels[locale].toLowerCase();
    if (label.includes(q)) return true;
    return c.keywords[locale].some((k) => k.toLowerCase().includes(q));
  });
}