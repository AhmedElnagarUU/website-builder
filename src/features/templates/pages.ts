import type { TemplateDefinition, TemplatePage, TemplateSection } from "./types";

export function allSections(template: TemplateDefinition): TemplateSection[] {
  return template.pages.flatMap((page) => page.sections);
}

export function findPage(template: TemplateDefinition, pageId: string): TemplatePage | undefined {
  return template.pages.find((p) => p.id === pageId);
}

export function homePage(template: TemplateDefinition): TemplatePage | undefined {
  return findPage(template, "home") ?? template.pages[0];
}

export function findPageBySlug(
  template: TemplateDefinition,
  slug: string
): TemplatePage | undefined {
  return template.pages.find((p) => p.slug === slug);
}

export function findSectionInTemplate(
  template: TemplateDefinition,
  sectionId: string
): TemplateSection | undefined {
  for (const page of template.pages) {
    const found = page.sections.find((s) => s.id === sectionId);
    if (found) return found;
  }
  return undefined;
}

export function findImageSlotInTemplate(
  template: TemplateDefinition,
  slotId: string
): TemplateSection | undefined {
  for (const page of template.pages) {
    for (const section of page.sections) {
      if ((section.images ?? []).some((img) => img.slotId === slotId)) return section;
    }
  }
  return undefined;
}

export function sectionForFieldKey(
  template: TemplateDefinition,
  fieldKey: string
): TemplateSection | undefined {
  for (const page of template.pages) {
    for (const section of page.sections) {
      if (section.fields.some((f) => f.key === fieldKey)) return section;
    }
  }
  return undefined;
}
