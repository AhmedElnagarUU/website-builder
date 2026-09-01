import type { CategoryId } from "@/features/sites/types";

export type SectionType =
  | "header"
  | "hero"
  | "services"
  | "about"
  | "testimonials"
  | "cta"
  | "contact"
  | "footer";

export interface TemplateField {
  key: string;
  purpose: string;
  constraint: { maxWords?: number; maxChars?: number };
  required: boolean;
}

export type AspectRatio = "1:1" | "16:9" | "4:3";

export interface ImageSlot {
  slotId: string;
  aspectRatio: AspectRatio;
  minWidth: number;
  minHeight: number;
  defaultAsset: string;
}

export interface TemplateSection {
  id: string;
  type: SectionType;
  fields: TemplateField[];
  images?: ImageSlot[];
  svcCount?: number;
}

export interface TemplateStyle {
  fontPair: "classic" | "modern" | "warm";
  radius: "sharp" | "soft";
  imagery: "photo" | "minimal";
}

export interface BilingualText {
  en: string;
  ar: string;
}

export interface TemplateDefinition {
  id: string;
  name: BilingualText;
  description: BilingualText;
  categories: CategoryId[];
  rtlValidated: boolean;
  style: TemplateStyle;
  colors: { defaultAccent: string };
  sections: TemplateSection[];
}