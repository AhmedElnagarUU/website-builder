export const locales = ["en", "ar"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirFor(locale: string): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}