export const BRAND_PALETTE = [
  "#1e40af",
  "#0f172a",
  "#b45309",
  "#7c2d12",
  "#15803d",
  "#0e7490",
  "#4338ca",
  "#7c3aed",
  "#db2777",
  "#1f2937",
] as const;

export type BrandColor = (typeof BRAND_PALETTE)[number];

export function isBrandColor(value: unknown): value is BrandColor {
  return (
    typeof value === "string" && (BRAND_PALETTE as readonly string[]).includes(value)
  );
}
