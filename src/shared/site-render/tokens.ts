import type { TemplateStyle } from "@/features/templates/types";
import type { Position9 } from "@/features/sites/types";

export const FONT_FAMILIES: Record<TemplateStyle["fontPair"], string> = {
  classic: "font-serif",
  modern: "font-sans",
  warm: "font-sans",
};

export function siteBodyClass(_style: TemplateStyle): string {
  return "site-body";
}

export function siteHeadingClass(style: TemplateStyle): string {
  return style.theme.headingFont === "serif" ? "site-heading-serif" : "site-heading-sans";
}

export function siteSurfaceClass(style: TemplateStyle): string {
  return style.theme.surface === "deep" ? "site-surface-deep" : "";
}

export function hasDesign(style: TemplateStyle): boolean {
  return Boolean(style.design);
}

export function signatureClass(style: TemplateStyle): string {
  if (!style.design) return "";
  const slug = style.design.signature
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `site-sig-${slug}`;
}

export const RADIUS_CLASSES: Record<TemplateStyle["radius"], string> = {
  sharp: "rounded-none",
  soft: "rounded-[12px]",
};

export const CARD_RADIUS: Record<TemplateStyle["radius"], string> = {
  sharp: "rounded-none border-t-[3px]",
  soft: "rounded-2xl",
};

export const CARD_SHADOW: Record<TemplateStyle["radius"], string> = {
  sharp: "shadow-sm",
  soft: "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]",
};

export function parseBrandHex(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseBrandHex(hex);
  const sr = r / 255;
  const sg = g / 255;
  const sb = b / 255;
  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linear(sr) + 0.7152 * linear(sg) + 0.0722 * linear(sb);
}

export function textOnBrand(hex: string): string {
  return relativeLuminance(hex) > 0.179 ? "#000000" : "#ffffff";
}

export function positionToCss(pos?: Position9): string {
  switch (pos) {
    case "top-left":
      return "top left";
    case "top":
      return "top center";
    case "top-right":
      return "top right";
    case "left":
      return "center left";
    case "right":
      return "center right";
    case "bottom-left":
      return "bottom left";
    case "bottom":
      return "bottom center";
    case "bottom-right":
      return "bottom right";
    case "center":
    default:
      return "center";
  }
}
