"use client";

import type { ReactNode } from "react";
import { SiteEditModeContext, SiteBrandContext } from "./context";
import { FONT_FAMILIES, RADIUS_CLASSES, textOnBrand } from "./tokens";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { ServicesSection } from "./sections/ServicesSection";
import { AboutSection } from "./sections/AboutSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { CtaSection } from "./sections/CtaSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import type { TemplateDefinition } from "@/features/templates/types";
import type {
  SiteBusinessInfo,
  Locale,
  ContentField,
  SiteImage,
} from "@/features/sites/types";

const SECTION_COMPONENTS = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  about: AboutSection,
  testimonials: TestimonialsSection,
  cta: CtaSection,
  contact: ContactSection,
  footer: FooterSection,
} as const;

export interface RenderedSiteProps {
  template: TemplateDefinition;
  locale: Locale;
  content: Record<string, ContentField>;
  businessInfo: SiteBusinessInfo;
  images: Record<string, SiteImage>;
  brandColor: string;
  editMode?: boolean;
  onRequestEdit?: (fieldKey: string) => void;
  editingFieldKey?: string | null;
  renderInlineEditor?: (fieldKey: string) => ReactNode;
  s3PublicBaseUrl?: string;
}

export function SiteRenderer({
  template,
  content,
  businessInfo,
  images,
  brandColor,
  editMode = false,
  onRequestEdit = () => {},
  editingFieldKey = null,
  renderInlineEditor,
  s3PublicBaseUrl,
}: RenderedSiteProps) {
  const fontClass = FONT_FAMILIES[template.style.fontPair];
  const radiusClass = RADIUS_CLASSES[template.style.radius];
  const onBrand = textOnBrand(brandColor);

  return (
    <SiteEditModeContext.Provider
      value={{
        enabled: editMode,
        onRequestEdit,
        editingFieldKey,
        renderInlineEditor,
        s3PublicBaseUrl,
      }}
    >
      <SiteBrandContext.Provider value={{ brandColor, textOnBrand: onBrand }}>
        <div
          className={`min-h-full bg-background text-foreground ${fontClass} ${radiusClass}`}
          style={{ ["--brand" as string]: brandColor }}
          dir="inherit"
        >
          {template.sections.map((section) => {
            const Component = SECTION_COMPONENTS[section.type];
            if (!Component) return null;
            return (
              <Component
                key={section.id}
                section={section}
                content={content}
                businessInfo={businessInfo}
                images={images}
              />
            );
          })}
        </div>
      </SiteBrandContext.Provider>
    </SiteEditModeContext.Provider>
  );
}
