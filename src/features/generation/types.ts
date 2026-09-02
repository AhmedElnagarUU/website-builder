import type { TemplateField, TemplateSection } from "@/features/templates/types";
import type { SiteBusinessInfo, Locale } from "@/features/sites/types";

export interface GenerationRequest {
  businessInfo: SiteBusinessInfo;
  sections: TemplateSection[];
  locale: Locale;
  otherSectionValues?: Record<string, string>;
}

export interface GenerationMessages {
  system: string;
  user: string;
}

export type ParsedFields = Record<string, string>;

export class BadResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadResponseError";
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderError";
  }
}

export interface ValidateContext {
  field: TemplateField;
  value: string;
}