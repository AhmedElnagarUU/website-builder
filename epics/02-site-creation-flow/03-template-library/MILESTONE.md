# Milestone 03 — Template Library & Selection (Step 2 of the journey)

## Goal

The user picks a template from a category-matched set without evaluating design tradeoffs. Templates are code-defined data: fixed structure, fixed fields with constraints, plain business-fit names, and RTL-validated layouts.

## Tasks (execution order)

1. `01-template-format-and-seed-library.md` — definition format, semantic field registry, 10 templates, preview assets.
2. `02-templates-listing-api.md` — endpoints for all/matched/single template definitions.
3. `03-template-selection-screen.md` — Step 2 screen + persisting the choice.

## Shared context — CANONICAL TEMPLATE DEFINITION FORMAT

Binding for Epics 03–05 (generation renders from it; renderer consumes it; publishing snapshots reference it).

```ts
export type SectionType = 'header'|'hero'|'services'|'about'|'testimonials'|'cta'|'contact'|'footer';
export type CategoryId = 'services'|'restaurant'|'retail'|'professional'|'portfolio';

export interface TemplateField {
  key: string;                 // from the Semantic Key Registry below
  purpose: string;             // English instruction for AI, e.g. "short hero headline stating the main offer"
  constraint: { maxWords?: number; maxChars?: number };
  required: boolean;           // template needs this non-empty
}
export interface ImageSlot {
  slotId: string;              // 'logo' | 'hero_image' | 'gallery_1'…
  aspectRatio: '1:1'|'16:9'|'4:3';
  minWidth: number; minHeight: number;   // below → low-res warning in editor (Epic 04)
  defaultAsset: string;        // public path used when user uploads nothing
}
export interface TemplateSection {
  id: string; type: SectionType;
  fields: TemplateField[];
  images?: ImageSlot[];
  svcCount?: number;           // services sections only: how many service_N_* pairs exist
}
export interface TemplateStyle {
  fontPair: 'classic'|'modern'|'warm';    // renderer maps to concrete stacks
  radius: 'sharp'|'soft';
  imagery: 'photo'|'minimal';
}
export interface TemplateDefinition {
  id: string;                  // kebab-case, immutable
  name: { en: string; ar: string };          // plain name — never layout terms
  description: { en: string; ar: string };   // ONE line about business fit
  categories: CategoryId[];
  rtlValidated: boolean;       // ALL seed templates ship as true; Arabic option only shows these
  style: TemplateStyle;
  colors: { defaultAccent: string };         // initial brandColor when selected
  sections: TemplateSection[]; // FIXED ORDER = the page structure
}
```

### Semantic Key Registry (prose fields ONLY — factual fields render from `businessInfo`, never stored here)

Navigation: `nav_home, nav_services, nav_about, nav_contact`
Hero: `hero_headline` (≤10 words), `hero_subline` (≤20 words)
About: `about_title` (≤6 words), `about_body` (≤600 chars)
Services: `services_title` (≤5 words), then per index N=1..svcCount: `service_{N}_title` (≤6 words), `service_{N}_description` (≤280 chars)
Testimonials (SAMPLE content only — never fabricated real quotes): `testimonial_1_quote` (≤220 chars), `testimonial_1_author` (≤40), optionally `_2_`
CTA: `cta_headline` (≤8 words), `cta_button_label` (≤3 words)
Contact section prose: `contact_heading` (≤4 words), `contact_body` (≤200 chars)
Footer: `footer_text` (≤140 chars)

FAQs are deliberately NOT in any MVP template (scope cut; format supports adding them later).

### The 10 seed templates (2 per category)

| id | category | name (en/ar) | svcCount | testimonials | image slots |
|---|---|---|---|---|---|
| `classic-services` | services | Classic Services / الخدمات الكلاسيكية | 3 | yes (2) | logo, hero_image |
| `modern-studio` | services | Modern Studio / الاستوديو العصري | 4 | no | logo, hero_image, gallery_1..2 |
| `warm-kitchen` | restaurant | Warm Kitchen / المطبخ الدافئ | 3 | yes (1) | logo, hero_image, gallery_1..3 |
| `bistro-menu` | restaurant | Bistro Menu / قائمة البيسترو | 4 | no | logo, hero_image |
| `simple-shop` | retail | Simple Shop / المتجر البسيط | 3 | no | logo, hero_image, gallery_1..3 |
| `product-focus` | retail | Product Focus / تركيز على المنتج | 2 | yes (1) | logo, hero_image |
| `professional-profile` | professional | Professional Profile / الملف المهني | 3 | yes (1) | logo, hero_image |
| `consultant-page` | professional | Consultant Page / صفحة المستشار | 4 | no | logo, hero_image |
| `clean-portfolio` | portfolio | Clean Portfolio / الأعمال النظيفة | 2 | no | logo, hero_image, gallery_1..3 |
| `visual-showcase` | portfolio | Visual Showcase / العرض المرئي | 3 | yes (2) | logo, hero_image |

All include header/hero/services/about/cta/contact/footer sections (testimonials optional per table). Every section order is FIXED by each template's array order.

### Preview assets

`public/templates/{id}/preview.svg` — a simple SVG mockup of the template showing REALISTIC sample copy for its category (e.g. actual dish names for restaurants). Never lorem ipsum. Default (empty-slot) images live at the paths referenced by each slot's `defaultAsset` under `public/templates/defaults/{category}/…`.

### Ranking rule (used by API)

Templates whose `categories` include the site's category come FIRST ("suggested"); the rest follow in stable catalog order. Suggestion failure is silent — there is always a full list fallback.
