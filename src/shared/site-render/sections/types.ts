import type { TemplateSection, ImageSlot } from "@/features/templates/types";
import type { SiteBusinessInfo, ContentField, SiteImage } from "@/features/sites/types";

export interface SectionRenderProps {
  section: TemplateSection;
  content: Record<string, ContentField>;
  businessInfo: SiteBusinessInfo;
  images: Record<string, SiteImage>;
}

export function sectionImages(
  section: TemplateSection
): ImageSlot[] {
  return section.images ?? [];
}
