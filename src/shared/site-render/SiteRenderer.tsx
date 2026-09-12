"use client";

import type { ReactNode } from "react";
import {
  SiteEditModeContext,
  SiteBrandContext,
  SiteNavContext,
  SiteStyleContext,
  type NavPage,
} from "./context";
import { FONT_FAMILIES, RADIUS_CLASSES, textOnBrand, siteBodyClass, siteSurfaceClass } from "./tokens";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { ServicesSection } from "./sections/ServicesSection";
import { AboutSection } from "./sections/AboutSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { CtaSection } from "./sections/CtaSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import { MenuSection } from "./sections/MenuSection";
import { GallerySection } from "./sections/GallerySection";
import { FaqSection } from "./sections/FaqSection";
import { HoursSection } from "./sections/HoursSection";
import { PricingSection } from "./sections/PricingSection";
import { TeamSection } from "./sections/TeamSection";
import { homePage } from "@/features/templates/pages";
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
  menu: MenuSection,
  gallery: GallerySection,
  faq: FaqSection,
  hours: HoursSection,
  pricing: PricingSection,
  team: TeamSection,
} as const;

export interface RenderedSiteProps {
  template: TemplateDefinition;
  locale: Locale;
  pageId?: string;
  content: Record<string /* pageId */, Record<Locale, Record<string, ContentField>>>;
  businessInfo: SiteBusinessInfo;
  images: Record<string, SiteImage>;
  brandColor: string;
  editMode?: boolean;
  onRequestEdit?: (fieldKey: string) => void;
  editingFieldKey?: string | null;
  renderInlineEditor?: (fieldKey: string) => ReactNode;
  s3PublicBaseUrl?: string;
  pageBaseHref?: string;
  onNavigatePage?: (pageId: string) => void;
}

function renderSections(
  sections: TemplateDefinition["pages"][number]["sections"],
  C: typeof SECTION_COMPONENTS,
  content: Record<string, ContentField>,
  businessInfo: SiteBusinessInfo,
  images: Record<string, SiteImage>,
  skipTypes: readonly string[]
) {
  return sections.map((section) => {
    if (skipTypes.includes(section.type)) return null;
    const Component = C[section.type];
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
  });
}

export function SiteRenderer({
  template,
  locale,
  pageId = "home",
  content,
  businessInfo,
  images,
  brandColor,
  editMode = false,
  onRequestEdit = () => {},
  editingFieldKey = null,
  renderInlineEditor,
  s3PublicBaseUrl,
  pageBaseHref = "",
  onNavigatePage,
}: RenderedSiteProps) {
  const fontClass = FONT_FAMILIES[template.style.fontPair];
  const radiusClass = RADIUS_CLASSES[template.style.radius];
  const onBrand = textOnBrand(brandColor);

  const home = homePage(template);
  const activePage =
    template.pages.find((p) => p.id === pageId) ?? template.pages[0] ?? home;

  const homeContent = home ? content[home.id]?.[locale] ?? {} : {};
  const activeContent = content[activePage.id]?.[locale] ?? {};

  const navPages: NavPage[] = template.pages
    .filter((p) => p.nav !== false || p.id === "home")
    .map((p) => ({ id: p.id, slug: p.slug, name: p.name }));

  const chromeSections = home ? home.sections : [];
  const headerSection = chromeSections.find((s) => s.type === "header");
  const footerSection = chromeSections.find((s) => s.type === "footer");

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
        <SiteNavContext.Provider
          value={{
            pages: navPages,
            activePageId: activePage.id,
            locale,
            pageBaseHref,
            onNavigatePage: editMode ? onNavigatePage : undefined,
          }}
        >
          <SiteStyleContext.Provider value={template.style}>
            <div
              className={`@container min-h-screen bg-background text-foreground ${siteBodyClass(template.style)} ${siteSurfaceClass(template.style)} ${fontClass} ${radiusClass}`}
              style={{
                ["--brand" as string]: brandColor,
                ...template.style.design?.palette,
                ...(template.style.design?.fonts
                  ? {
                      ["--font-serif2" as string]: template.style.design.fonts.heading,
                      ["--font-body" as string]: template.style.design.fonts.body,
                      ["--font-mono" as string]: template.style.design.fonts.mono,
                    }
                  : null),
              }}
              dir="inherit"
            >
            {headerSection && (
              <HeaderSection
                key={headerSection.id}
                section={headerSection}
                content={homeContent}
                businessInfo={businessInfo}
                images={images}
              />
            )}
            {renderSections(
              activePage.sections,
              SECTION_COMPONENTS,
              activeContent,
              businessInfo,
              images,
              ["header", "footer"]
            )}
            {footerSection && (
              <FooterSection
                key={footerSection.id}
                section={footerSection}
                content={homeContent}
                businessInfo={businessInfo}
                images={images}
              />
            )}
          </div>
          </SiteStyleContext.Provider>
        </SiteNavContext.Provider>
      </SiteBrandContext.Provider>
    </SiteEditModeContext.Provider>
  );
}
