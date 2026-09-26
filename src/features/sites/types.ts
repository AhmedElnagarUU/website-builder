import type { Types } from "mongoose";

export type CategoryId =
  | "services"
  | "restaurant"
  | "retail"
  | "professional"
  | "portfolio"
  | "construction"
  | "interior_design"
  | "law"
  | "software_it"
  | "real_estate"
  | "beauty_fitness"
  | "education"
  | "automotive"
  | "events"
  | "travel"
  | "b2b"
  | "clinics";

export const CATEGORIES: CategoryId[] = [
  "services",
  "restaurant",
  "retail",
  "professional",
  "portfolio",
  "construction",
  "interior_design",
  "law",
  "software_it",
  "real_estate",
  "beauty_fitness",
  "education",
  "automotive",
  "events",
  "travel",
  "b2b",
  "clinics",
];

export type Locale = "en" | "ar";
export type SiteStatus = "draft" | "published" | "unpublished";
export type WizardStep =
  | "business_info"
  | "templates"
  | "language"
  | "generating"
  | "editing";

export interface SiteBusinessInfo {
  name: string;
  category: CategoryId;
  description?: string;
  targetCustomers?: string;
  services?: string;
  location?: string;
  contactPhone?: string;
  contactEmail?: string;
  usps?: string[];
  notes?: string[];
}

export type ContentOrigin = "ai" | "user" | "placeholder";

export interface ContentField {
  value: string;
  origin: ContentOrigin;
  edited: boolean;
  reviewFlagged?: boolean;
}

export type Position9 =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export interface SiteImage {
  s3Key: string;
  width?: number;
  height?: number;
  position?: Position9;
}

export type PageContent = Record<Locale, Record<string, ContentField>>;
export type SiteContent = Record<string /* pageId */, PageContent>;

export interface PublishedSnapshot {
  templateId: string;
  activeLanguages: Locale[];
  content: SiteContent;
  images: Record<string, SiteImage>;
  brandColor: string;
  publishedAt: Date;
}

export type GenerationStatus =
  | "idle"
  | "queued"
  | "running"
  | "complete"
  | "failed";

export interface SiteGeneration {
  status: GenerationStatus;
  error?: string;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface Site {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  status: SiteStatus;
  currentStep: WizardStep;
  businessInfo: SiteBusinessInfo;
  templateId?: string;
  languagesRequested: Locale[];
  activeLanguages: Locale[];
  content: SiteContent;
  images: Record<string, SiteImage>;
  brandColor: string;
  slug?: string;
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
  generation: SiteGeneration;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteDTO {
  _id: string;
  ownerId: string;
  status: SiteStatus;
  currentStep: WizardStep;
  businessInfo: SiteBusinessInfo;
  templateId?: string;
  languagesRequested: Locale[];
  activeLanguages: Locale[];
  content: SiteContent;
  images: Record<string, SiteImage>;
  brandColor: string;
  slug?: string;
  publishedSnapshot: PublishedSnapshot | null;
  hasUnpublishedChanges: boolean;
  generation: SiteGeneration;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteInput {
  ownerId: string;
}

export type UpdateSitePatch = Partial<Omit<Site, "_id" | "ownerId" | "createdAt">>;