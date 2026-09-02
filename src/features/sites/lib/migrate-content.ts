import type { ContentField, Locale, SiteContent } from "../types";

function looksLikeFieldMap(v: unknown): boolean {
  return (
    typeof v === "object" &&
    v !== null &&
    Object.values(v as Record<string, unknown>).some(
      (f) => typeof f === "object" && f !== null && "value" in (f as Record<string, unknown>)
    )
  );
}

export function isLegacyFlatContent(content: SiteContent): boolean {
  if (typeof content !== "object" || content === null) return false;
  const rec = content as Record<string, unknown>;
  const hasHome = rec["home"] !== undefined;
  const enIsFlat = rec["en"] !== undefined && looksLikeFieldMap(rec["en"]);
  const arIsFlat = rec["ar"] !== undefined && looksLikeFieldMap(rec["ar"]);
  if (hasHome) return false;
  return enIsFlat || arIsFlat;
}

export function migrateFlatContent(content: SiteContent): SiteContent {
  const rec = content as Record<string, unknown>;
  const en = (rec["en"] ?? {}) as Record<string, ContentField>;
  const ar = (rec["ar"] ?? {}) as Record<string, ContentField>;
  const home: Record<Locale, Record<string, ContentField>> = { en, ar };
  return { home };
}
