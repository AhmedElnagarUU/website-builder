# Template Structure — Reverse-Engineered Reference

> **Source of truth:** this document is derived from the actual codebase. Every conclusion
> below is traced to a specific file. Where a behavior could not be confirmed from code,
> it is explicitly marked **Inferred** or **Unknown** rather than assumed.

---

## 1. Purpose

This document explains exactly how the Website Builder's template system works, so that a
developer or AI agent can build a *completely new* template (or redesign an existing one)
that is guaranteed to render with the existing engine — **without changing any engine code.**

Templates are **data-driven and declarative**: a template is a plain TypeScript object
describing its pages and sections. The engine (renderer) consumes that object and turns it
into a website. There are **no per-template React components** — every template is rendered
by the same generic section components, chosen by `section.type`.

---

## 2. Template System Overview

The system is split into two halves:

1. **Template definitions** — static, code-defined metadata describing the *shape* of each
   template: its pages, the sections each page contains, every editable text field and every
   image slot. This lives in `src/features/templates/`.
2. **The renderer** — a generic, shared React renderer that takes a `TemplateDefinition`
   plus a site's stored *content* (the actual words/images the site owner chose) and renders
   the final website. This lives in `src/shared/site-render/`.

Key architectural facts:

- **A template is NOT a React component.** It is a plain data object.
- **There is one renderer** (`SiteRenderer`) used for preview, editing, and the live
  published site.
- **Templates do not carry their own layout/components.** The layout is produced by shared
  section components selected by the `type` of each section.
- **"Home" is the page with `id: "home"`** and slug `""`. It is where the header and footer
  sections live.
- **The homepage aggregate** (header + footer chrome) is shared across all pages via the
  renderer, not duplicated per page.

---

## 3. Template Lifecycle

```
TemplateDefinition (static, in catalog.ts)
        ↓
Registered in the TEMPLATES array (the registry)
        ↓
Selected by the owner during the create wizard ("templates" step) → site.templateId
        ↓
AI generation reads the template's page sections & fields → writes site.content
        ↓
SiteRenderer (given template + content) resolves pages/sections
        ↓
Section components render F() fields and SlotImage() slots
        ↓
Header + Footer injected from the home page
        ↓
Final website rendered (preview / editor / live)
```

---

## 4. Template Architecture

Directory layout relevant to templates:

```
src/features/templates/
  types.ts          ← ALL TypeScript contracts (TemplateDefinition, TemplatePage, ...)
  catalog.ts        ← the TEMPLATES array — the registry + definition builders
  pages.ts          ← helper queries over a TemplateDefinition (findPage, homePage, ...)
  api/list-templates.ts   ← getTemplate() / listTemplates() / rankTemplatesByCategory()
  api/update-site-template.ts  ← persistence when owner changes template
  lib/demoContent.ts ← demo copy used by the /preview route only

src/shared/site-render/
  SiteRenderer.tsx      ← the renderer
  context.ts            ← edit-mode / brand / nav / style React contexts
  tokens.ts             ← font/radius/surface/theme helpers + brand parsing
  internals.tsx         ← F() (edit field) and SlotImage() (image slot) primitives
  atoms.tsx             ← SectionHead, SiteCard, StatBlock, CtaBand (reusable UI)
  sections/             ← one component per section type

src/app/preview/[templateId]/[[...slug]]/page.tsx  ← public template preview routes
src/app/live/...                                   ← published site routes
```

There is **no separate "registry" file** — the registry *is* `catalog.ts`.

---

## 5. Template Contract

`TemplateDefinition` (defined in `src/features/templates/types.ts:83`):

```ts
interface TemplateDefinition {
  id: string;              // unique, machine-readable, e.g. "classic-services"
  name: BilingualText;     // { en, ar }
  description: BilingualText;
  categories: CategoryId[]; // "services" | "restaurant" | "retail" | "professional" | "portfolio"
  rtlValidated: boolean;   // has this template been validated for RTL rendering?
  style: TemplateStyle;    // how the renderer styles the sections
  colors: { defaultAccent: string };  // default brand color, hex e.g. "#1E40AF"
  pages: TemplatePage[];   // every page in the template
  screenshot?: string;     // URL/asset path to a screenshot for the gallery UI
}
```

`BilingualText` is `{ en: string; ar: string }` — Arabic is a **first-class field**, not a
translation skin.

---

## 6. Template Registration

**Registration is static and manual.** The registry is the exported array
`src/features/templates/catalog.ts:375`:

```ts
export const TEMPLATES: TemplateDefinition[] = [ ... ];
```

- Every template present in `TEMPLATES` automatically:
  - becomes selectable in the create wizard (`rankTemplatesByCategory` splits it into
    "suggested" and "others"),
  - becomes routable at `/preview/<id>` (via `generateStaticParams` in
    `src/app/preview/[templateId]/[[...slug]]/page.tsx`),
  - becomes renderable when a site's `templateId` matches.
- To look a template up: `getTemplate(id)` in `src/features/templates/api/list-templates.ts:37`.

> **To add a new template:** add one object to the `TEMPLATES` array. That is the whole
> registration — no route, no component, no import elsewhere is required. **Confirmed.**

> If a `templateId` on a site does not match anything in `TEMPLATES`, the site cannot be
> published (`publish-site.ts:41` returns `not_found`) and generation fails
> (`run-generation.ts:107`).

---

## 7. Template Definition

Templates are written as **TypeScript objects**, assembled by helper "builder" functions
in `catalog.ts` (e.g. `buildPages`, `buildHero`, `buildServices`, `buildFooter`). There is
no JSON on disk and no database source of truth at definition time — the definitions are
compiled into the bundle.

The builders standardize each template around a fixed skeleton:

- Every template has a **home** page (`id: "home"`, `slug: ""`).
- The home page always begins with a `header` section and ends with a `footer` section.
- Every template has **about**, **services**, and **contact** pages.
- Templates may add extra pages: `menu`, `gallery`, `faq`, `hours`, `pricing`, `team`
  (these are declared via the `extras` spec in each `def(...)` call, `catalog.ts:274-351`).

The built-in catalog contains 10 templates: `classic-services`, `modern-studio`,
`warm-kitchen`, `bistro-menu`, `simple-shop`, `product-focus`, `professional-profile`,
`consultant-page`, `clean-portfolio`, `visual-showcase`.

---

## 8. Page Structure

`TemplatePage` (`types.ts:75`):

```ts
interface TemplatePage {
  id: string;           // e.g. "home", "about", "services", "contact", "menu", ...
  slug: string;         // URL path segment; "" for home
  name: BilingualText;
  sections: TemplateSection[];  // the page's content sections
  nav?: boolean;        // if false, the page is hidden from header/footer nav
}
```

Page-level facts **confirmed from code**:

- The **home page** is identified by `id === "home"` (`pages.ts:11-13`, `homePage()`).
- The **home page slug is `""`** — it resolves to the base URL.
- The home page holds the **header** and **footer** sections. They are NOT auto-injected
  by the renderer; they are *explicit sections in the home page*, and the renderer lifts
  them out and applies them globally to every rendered page (`SiteRenderer.tsx:124-179`).
- **Other pages do not need header/footer sections** — the renderer overlays the home page's
  header/footer onto whatever page is active. **Confirmed.**
- `nav: false` hides a page from header/footer nav, but the page is still routable.
  (`SiteRenderer.tsx:120-122` filters with `p.nav !== false || p.id === "home"` — home is
  always shown).
- Page `slug` is used for routing; the "home" resolution falls back to
  `p.id === "home"` if an explicit slug lookup fails.

Page lookup helpers (`pages.ts`): `findPage`, `homePage`, `findPageBySlug`,
`findSectionInTemplate`, `findImageSlotInTemplate`, `sectionForFieldKey`.

---

## 9. Section Structure

`TemplateSection` (`types.ts:36`):

```ts
interface TemplateSection {
  id: string;             // stable unique id within the template (e.g. "s1")
  type: SectionType;      // the kind of section — see below
  fields: TemplateField[];  // every editable text field this section renders
  images?: ImageSlot[];     // every image slot this section renders
  svcCount?: number;        // # of service cards (services)
  itemCount?: number;       // # of items (menu)
  faqCount?: number;        // # of Q&A (faq)
  planCount?: number;       // # of pricing plans (pricing)
  memberCount?: number;     // # of team members (team)
}
```

`SectionType` (`types.ts:3`): `"header" | "hero" | "services" | "about" | "testimonials" |
"cta" | "contact" | "footer" | "menu" | "gallery" | "faq" | "hours" | "pricing" | "team"`.

`TemplateField` (`types.ts:19`): `{ key, purpose, constraint: { maxWords?, maxChars? }, required }`.

`ImageSlot` (`types.ts:28`): `{ slotId, aspectRatio: "1:1"|"16:9"|"4:3", minWidth, minHeight, defaultAsset }`.

**How the renderer resolves a section into UI:**
`SiteRenderer.tsx:35-50` maps each `type` to a component in `SECTION_COMPONENTS`. Sections
are rendered in the order they appear in `page.sections`, skipping any type with no matching
component and skipping `header`/`footer` on active pages (they are handled separately).

> **Critical:** `section.type` is the ONLY connection between a template's data and its
> rendering. To use a section, its `type` must be one of the 14 values above and its
> `fields`/`images` keys must match what the matching component expects.

The section **ID** is used by React as the `key` and as an editing target — it must be
unique within the template.

---

## 10. Components

The renderer has a fixed set of **generic** section components (no template-specific
components exist). Each lives in `src/shared/site-render/sections/` and receives the same
props (`SectionRenderProps` in `sections/types.ts`):

```ts
interface SectionRenderProps {
  section: TemplateSection;
  content: Record<string, ContentField>;   // locale-scoped field values for THIS page
  businessInfo: SiteBusinessInfo;
  images: Record<string, SiteImage>;
}
```

### Section components and their field/slot contracts

| `type` | Component (file) | Expected fields (`field.key`) | Expected image slots | Count prop |
|---|---|---|---|---|
| `header` | `sections/HeaderSection.tsx` | `nav_<pageId>` (e.g. `nav_about`) for each nav page; also uses `businessInfo.name` | `logo` | — |
| `hero` | `sections/HeroSection.tsx` | `hero_headline`, `hero_subline` | `logo`, `hero_image` | — |
| `services` | `sections/ServicesSection.tsx` | `services_title`, `service_<n>_title`, `service_<n>_description` (n=1..svcCount) | — | `svcCount` |
| `about` | `sections/AboutSection.tsx` | `about_title`, `about_body` | — | — |
| `testimonials` | `sections/TestimonialsSection.tsx` | `testimonial_<n>_quote`, `testimonial_<n>_author` | — | (derived from fields) |
| `cta` | `sections/CtaSection.tsx` | `cta_headline`, `cta_button_label` | — | — |
| `contact` | `sections/ContactSection.tsx` | `contact_heading`, `contact_body` (+ `businessInfo`) | — | — |
| `footer` | `sections/FooterSection.tsx` | `footer_text` (+ `businessInfo`) | — | — |
| `menu` | `sections/MenuSection.tsx` | `menu_title`, `menu_item_<n>_name`, `menu_item_<n>_description`, `menu_item_<n>_price` | — | `itemCount` |
| `gallery` | `sections/GallerySection.tsx` | `gallery_title` | `gallery_<n>` | (from image slots) |
| `faq` | `sections/FaqSection.tsx` | `faq_title`, `faq_<n>_question`, `faq_<n>_answer` | — | `faqCount` |
| `hours` | `sections/HoursSection.tsx` | `hours_title`, `hours_monday`…`hours_sunday` | — | (fixed 7 days) |
| `pricing` | `sections/PricingSection.tsx` | `pricing_title`, `plan_<n>_name`, `plan_<n>_price`, `plan_<n>_description` | — | `planCount` |
| `team` | `sections/TeamSection.tsx` | `team_title`, `team_<n>_name`, `team_<n>_role` | `team_<n>_image` | `memberCount` |

### Reusable rendering primitives (used inside sections)

- `F` (`internals.tsx`) — renders an editable text field. In view mode it renders the
  stored value; in edit mode it draws an inline editor / dashed placeholder.
- `SlotImage` (`internals.tsx`) — renders an image slot. Uses `image.s3Key` (S3) when a real
  image is set, otherwise falls back to `defaultAsset` (e.g. `/templates/real/<cat>/hero.webp`).
- `atoms.tsx` — `SectionHead` (section title + eyebrow accent), `SiteCard` (card styling that
  adapts to theme accent role/radius), `StatBlock`, `CtaBand`.

> **Mandatory vs optional:** the field *keys* a component reads are fixed by the component
> code. If a section omits a field the component requires, the section renders an empty
> field (in view mode) or an empty-editing placeholder (in edit mode) — it does **not** crash.

---

## 11. Header

- **Defined in** `src/shared/site-render/sections/HeaderSection.tsx` (shared component).
- **Included** as an explicit `type: "header"` section on the **home page**; the renderer
  lifts it out and applies it to every page (`SiteRenderer.tsx:154-162`).
- **Template-wide, not per-page.** A new template reuses the shared component — it does NOT
  write its own header. To customize it, change what it reads from the template (id/labels)
  or edit the shared component (affects all templates). **Confirmed.**
- Reads nav pages from `SiteNavContext` (built from `template.pages`, respecting `nav`).
- Logo: renders the `logo` `SlotImage` if present; business name from `businessInfo.name`.
- Nav links: one per nav page, label from `nav_<pageId>` field (falls back to `page.name`).
- Mobile: hamburger menu toggled by state; hidden nav at `< @3xl`, shown below.
- In edit mode, clicking a link calls `onNavigatePage(pageId)` instead of navigating.

---

## 12. Footer

- **Defined in** `src/shared/site-render/sections/FooterSection.tsx` (shared component).
- **Included** as an explicit `type: "footer"` section on the home page; applied globally.
- **Template-wide, not per-page.** A new template reuses the shared component. **Confirmed.**
- Renders `businessInfo.name`, the `footer_text` field, a nav list of non-home pages, and a
  copyright line `© <year> — <name>`.
- Styling adapts to `style.theme` (deep surface → border, accent edge → colored top border).

---

## 13. Navigation & Routing

Routing is **static, slug-based**, generated from `template.pages`:

- **Pages identified by** `page.id` internally and `page.slug` in the URL.
- **URLs generated** by the components from `pageBaseHref` + `page.slug`
  (`pageBaseHref` = "/", or `/preview/<templateId>`, or `/live/<slug>/<lang>`).
- **Homepage** is `slug === ""` → resolves to `pageBaseHref`/"`/`".
- The renderer lets single-page sites be viewed: `activePage = pages.find(p => p.id === pageId)
  ?? pages[0] ?? home` (`SiteRenderer.tsx:114-115`).
- In **view mode**, header/footer nav render real `<a href>` links.
- In **edit mode**, navigation is internal (`onNavigatePage`) and does not change the URL.

**Preview route** (`src/app/preview/[templateId]/[[...slug]]/page.tsx`):
- `/preview/<id>` → home page; `/preview/<id>/<slug>` → matching page via `find(p.slug === slug[0])`.
- `generateStaticParams` enumerates all templates + non-empty slugs at build time.

**Live/published routes** (`src/app/live/...`):
- `/live/<siteSlug>` → redirects to the default locale.
- `/live/<siteSlug>/<lang>` → home page.
- `/live/<siteSlug>/<lang>/<pageSlug>` → resolved via `getTemplatePages(templateId)` and `p.slug`.

> A site slug (`site.slug`) is the *site instance's* public slug (stored at publish time),
> distinct from a *template page's* `slug`. Don't confuse the two.

---

## 14. Assets

Asset resolution is **centralized**, not per-template-component:

- Template **default images** (used until the owner uploads real ones) live in
  `public/templates/real/<category>/*.webp` and are referenced via
  `ImageSlot.defaultAsset` (e.g. `/templates/real/services/hero.webp`). See `catalog.ts:75-83`.
- A parallel set of **SVG placeholders** exists under `public/templates/defaults/<category>/`
  (used by the thumbnail fallback, not by the renderer's `SlotImage`).
- **Owner-uploaded images** are stored in S3; runtime resolves them from `image.s3Key`
  (via `s3PublicBaseUrl`). See `internals.tsx:86-90`.
- **Thumbnails/preview assets** referenced by `template.screenshot` (e.g.
  `/templates/<id>/screenshot.png`) and the fallback `preview.svg` under
  `public/templates/<id>/`. See `components/TemplateThumbnail.tsx`.

Recommended structure for a new template's demo images:
`public/templates/real/<category>/` for the default `ImageSlot` images, and
`public/templates/<templateId>/` for `preview.svg` / `screenshot.png` used by the gallery.

> `ImageSlot.minWidth / minHeight` are advisory constraints (shown in the image editor);
> the renderer's `SlotImage` does not enforce them.

---

## 15. Styling & Theme

Styling is **semi-global**: templates declare a small set of high-level theme choices via
`TemplateStyle`, and the shared components + shared global CSS turn those into visuals.

`TemplateStyle` (`types.ts:63`):

```ts
interface TemplateStyle {
  fontPair: "classic" | "modern" | "warm";
  radius: "sharp" | "soft";
  imagery: "photo" | "minimal";
  theme: TemplateTheme;
}
```

`TemplateTheme` (`types.ts:55`):

```ts
interface TemplateTheme {
  key: "corporate" | "bold" | "warm" | "retail" | "creative";
  surface: "light" | "deep";        // deep = dark site
  headingFont: "serif" | "sans";
  hero: "photo-bleed" | "split-light" | "split-deep";  // picks the hero variant
  accentRole: "fill" | "edge";      // how accent color is applied
}
```

- **Fonts:** `FONT_FAMILIES` (`tokens.ts:4`) maps `fontPair` → Tailwind class. Headings use
  `site-heading-serif` / `site-heading-sans`; `:lang(ar)` overrides swap in Arabic fonts
  (`globals.css:201`). **Do not set `font-family` directly on sections** — use these classes.
- **Brand color:** injected from `site.brandColor` (or `template.colors.defaultAccent`) as a
  CSS variable `--brand` and via `SiteBrandContext`. `textOnBrand` computes black/white text.
- **Radius:** `RADIUS_CLASSES` + `CARD_RADIUS`/`CARD_SHADOW` (`tokens.ts`).
- **Deep surface:** `site-surface-deep` overrides CSS variables (`globals.css:211`) so
  `bg-background`/`bg-card`/text classes adapt within the renderer.
- **Global semantic CSS variables** (`--background`, `--card`, `--foreground`, ...) are
  defined in the root layout / globals; sections use these utility classes.

**What a template controls:** colors (via defaultAccent + owner brandColor), typography
(fontPair, headingFont), radius, light/dark (surface), hero variant, accent role, and the
theme key (which drives several sections' layouts, e.g. services layout differs by key).

**What a template does NOT control:** Tailwind theme, spacing scale, breakpoints, the actual
section DOM structure (that's shared code).

---

## 16. Responsive Behavior

Responsiveness is handled by the **shared components**, not per-template:

- **Container queries** (`@container` on the root, `@3xl:`, `@5xl:`, `@2xl:`, `@4xl:`
  variants) drive column counts and font sizes inside sections. The renderer root uses
  `@container min-h-screen` (`SiteRenderer.tsx:150`).
- Desktop/tablet/mobile preview widths are simulated in the editor (`DeviceToggle` +
  `EditorShell.tsx:270-277`).
- The **header** collapses to a hamburger below `@3xl`; nav links use flex-wrap elsewhere.
- Grids reflow from multi-column at large container widths to single-column on small ones
  (e.g. `services`, `gallery`, `team`, `pricing` all use conditional `grid-cols-*`).
- **RTL** is first-class: logical CSS props (`ps-*`, `pe-*`, `border-s`, `text-start`,
  `ms-auto`) are used throughout, and the root respects `dir="inherit"` / `:lang(ar)` swaps.

A new template does not need to write its own responsive CSS; it inherits it from the shared
sections. Choosing a theme (deep/light, accent role, radius) is how it differentiates.

---

## 17. Data Flow

```
site.templateId (string, e.g. "classic-services")
        ↓  getTemplate(id) — list-templates.ts
TemplateDefinition (registry object)
        ↓  SiteRenderer resolvePage(pageId)
Active TemplatePage
        ↓  iterate page.sections
TemplateSection
        ↓  SECTION_COMPONENTS[section.type]
Section component
        ↓  reads content[pageId][locale][fieldKey] via F() / SlotImage()
Rendered HTML (wrapped in SiteRenderer root + injected header/footer)
```

### Content data model (the owner's actual words/images)

Stored on the site document and passed to the renderer:

```ts
type SiteContent = Record<pageId, Record<locale, Record<fieldKey, ContentField>>>;
```

`ContentField` (`sites/types.ts:42`): `{ value, origin: "ai"|"user"|"placeholder", edited, reviewFlagged? }`.
`images` = `Record<slotId, SiteImage>` where `SiteImage = { s3Key, width?, height?, position? }`.

**Published snapshot** (`PublishedSnapshot`, `sites/types.ts:70`) captures `templateId`,
`activeLanguages`, `content`, `images`, `brandColor`, `publishedAt` — this is what the live
site renders from (`LiveSitePage.tsx`).

**AI generation** (`run-generation.ts`) iterates `template.pages` → `page.sections` →
`section.fields`, prompts the model with each field's key/purpose/constraint, and writes the
returned text into `site.content[page.id][locale][fieldKey]` (`prompt-builder.ts`, `merge-content.ts`).

---

## 18. Canonical Template Example

Based on the actual builders in `catalog.ts`, a minimal valid template looks like this
(simplified to the real data shape):

```ts
import type { TemplateDefinition } from "@/features/templates/types";

const myTemplate: TemplateDefinition = {
  id: "my-template",                              // unique
  name: { en: "My Template", ar: "قالبي" },
  description: { en: "A short description.", ar: "وصف قصير." },
  categories: ["services"],
  rtlValidated: true,
  style: {
    fontPair: "classic",
    radius: "soft",
    imagery: "photo",
    theme: { key: "corporate", surface: "light", headingFont: "serif",
             hero: "split-light", accentRole: "fill" },
  },
  colors: { defaultAccent: "#1E40AF" },
  screenshot: "/templates/my-template/screenshot.png",
  pages: [
    {
      id: "home",
      slug: "",
      name: { en: "Home", ar: "الرئيسية" },
      sections: [
        { id: "s1", type: "header",
          fields: [{ key: "nav_home", purpose: "Nav home", constraint: { maxWords: 2 }, required: true },
                   { key: "nav_about", purpose: "Nav about", constraint: { maxWords: 2 }, required: true },
                   { key: "nav_services", purpose: "Nav services", constraint: { maxWords: 2 }, required: true },
                   { key: "nav_contact", purpose: "Nav contact", constraint: { maxWords: 2 }, required: true }] },
        { id: "s2", type: "hero",
          fields: [
            { key: "hero_headline", purpose: "Headline", constraint: { maxWords: 10 }, required: true },
            { key: "hero_subline", purpose: "Subline", constraint: { maxWords: 20 }, required: true },
          ],
          images: [
            { slotId: "logo", aspectRatio: "1:1", minWidth: 64, minHeight: 64,
              defaultAsset: "/templates/real/services/logo.webp" },
            { slotId: "hero_image", aspectRatio: "16:9", minWidth: 1200, minHeight: 675,
              defaultAsset: "/templates/real/services/hero.webp" },
          ] },
        { id: "s3", type: "services",
          fields: [
            { key: "services_title", purpose: "Services title", constraint: { maxWords: 5 }, required: true },
            { key: "service_1_title", purpose: "Service 1 name", constraint: { maxWords: 6 }, required: true },
            { key: "service_1_description", purpose: "Service 1 desc", constraint: { maxChars: 280 }, required: true },
          ],
          svcCount: 1 },
        { id: "s4", type: "cta",
          fields: [
            { key: "cta_headline", purpose: "CTA headline", constraint: { maxWords: 8 }, required: true },
            { key: "cta_button_label", purpose: "CTA button", constraint: { maxWords: 3 }, required: true },
          ] },
        { id: "s5", type: "footer",
          fields: [{ key: "footer_text", purpose: "Footer text", constraint: { maxChars: 140 }, required: true }] },
      ],
    },
    { id: "about", slug: "about", name: { en: "About", ar: "من نحن" },
      sections: [{ id: "s6", type: "about",
        fields: [{ key: "about_title", purpose: "About title", constraint: { maxWords: 6 }, required: true },
                 { key: "about_body", purpose: "About body", constraint: { maxChars: 600 }, required: true }] }] },
    { id: "services", slug: "services", name: { en: "Services", ar: "خدماتنا" },
      sections: [{ id: "s7", type: "services",  /* reuse services fields */ }] },
    { id: "contact", slug: "contact", name: { en: "Contact", ar: "تواصل معنا" },
      sections: [{ id: "s8", type: "contact",
        fields: [{ key: "contact_heading", purpose: "Contact heading", constraint: { maxWords: 4 }, required: true },
                 { key: "contact_body", purpose: "Contact body", constraint: { maxChars: 200 }, required: true }] }] },
  ],
};
```

**Rule of thumb derived from the builders:** to be safe, follow the shape that
`catalog.ts` produces — mandatory pages `home` (header + hero/cta + footer), `about`,
`services`, `contact`; at minimum the header/footer/hero/services sections; and standard
field key prefixes (`hero_`, `service_`, `about_`, `cta_`, `contact_`, `footer_`, `nav_`,
plus the per-page ones `menu_`, `gallery_`, `faq_`, `hours_`, `plan_`, `team_`,
`testimonial_`).

---

## 19. How to Build a New Template

1. **Add demo image assets** (optional but recommended): put default images under
   `public/templates/real/<category>/` and a `preview.svg` (+ optional `screenshot.png`)
   under `public/templates/<new-id>/`.
2. **Define the template object** following the `TemplateDefinition` contract. Reuse the
   builder helpers in `catalog.ts` or author the object inline.
   - Include a `home` page with `id: "home"`, `slug: ""`, containing `header` + content +
     `footer` sections.
   - Include `about`, `services`, `contact` pages; add `menu`/`gallery`/`faq`/`hours`/
     `pricing`/`team` pages as `extras` if desired.
   - Give every section a unique `id`, a supported `type`, and `fields` whose keys match the
     component contracts (see §10). Add `images` only where the component expects a slot
     (`logo`, `hero_image`, `gallery_<n>`, `team_<n>_image`).
3. **Register it**: push it into the `TEMPLATES` array in `catalog.ts`.
4. **Set its identity/style**: unique `id`, `colors.defaultAccent`, and a `TemplateStyle`
   (font pair, radius, imagery, theme).
5. **Verify rendering**: open `/preview/<new-id>` and each `/preview/<new-id>/<slug>` page.
6. **Verify a generated site**: pick the template in the create wizard, run generation, and
   confirm the editor renders all fields and the site can be published.
7. **Add demo copy** in `demoContent.ts` (keyed by template id) so the preview shows real
   content; without it, preview falls back to the `classicServices` demo.

---

## 20. How to Replace/Redesign an Existing Template

Redesigning the *visual* output while keeping the engine unchanged means editing one of two
things:

### A. Redesign a template's look via its data (safe, no engine changes)

You may freely change, per template:

- `colors.defaultAccent`
- `style.theme.key` (drives several section layouts), `theme.surface` (light/dark),
  `theme.headingFont`, `theme.hero`, `theme.accentRole`
- `style.fontPair`, `style.radius`, `style.imagery`
- `name`, `description` (bilingual), `screenshot`

### B. Redesign the shared look for ALL templates (engine-level)

To change the actual pixel layout (card designs, grid, spacing, typography treatment), edit
the **shared components** in `src/shared/site-render/` (`sections/`, `atoms.tsx`,
`internals.tsx`, `tokens.ts`) and the shared CSS in `src/app/globals.css`. This changes every
template at once and is how you materialize visual redesigns without breaking data
compatibility.

### What must remain unchanged (do not break)

- **Template `id`** — persisted on every site (`site.templateId`) and in every published
  `PublishedSnapshot`. Changing it breaks existing sites. **Confirmed.**
- **Page `id`s** — e.g. `home`, `about`, `services`, `contact`, `menu`, ... are used as
  content keys (`site.content[pageId]`), nav targets, and route/SEO lookups
  (`page-shape.ts`, `LiveSitePage.tsx`). The home page id **must** be `"home"` and slug `""`.
- **Page `slug`s** — used in URLs and live routing (`/live/<slug>/<lang>/<pageSlug>`).
- **Section `type` values** — must stay among the 14 supported values; each maps to a
  specific shared component.
- **Required field keys** per section type — must match what the shared component reads
  (`hero_headline`, `services_title`, `service_<n>_title`, etc.).
- **The `home` page holding header + footer** sections — the renderer depends on finding a
  `header`-typed and `footer`-typed section on the home page.
- **`SiteContent` / `SiteImage` / `PublishedSnapshot` data shapes** — the stored content and
  the snapshot are consumed blindly by the renderer.
- **Registration** — the template stays in the `TEMPLATES` array.

### What can be redesigned freely

- All styling driven by `style`/`theme` (colors, fonts, radius, dark mode, hero variant,
  accent treatment).
- Layout, spacing, card designs, visual hierarchy, images — via the shared components/CSS.
- Section *ordering* and *which* sections appear on a page (as long as each section's fields
  match its type).
- Adding/removing `extras` pages (as long as required pages remain).

---

## 21. Immutable vs Flexible Parts

### Must Stay Compatible (engine depends on them — **Confirmed from code**)

| Part | Why |
|---|---|
| Template `id` | persisted on sites & snapshots; `getTemplate` lookup by id |
| Page `id`s (`home`, `about`, `services`, `contact`, …) | content keys, nav targets, routing, `page-shape` |
| Home `id === "home"` + `slug === ""` | `homePage()` and URL resolution depend on it |
| Page `nav` semantics | `nav !== false || id === "home"` filter in `SiteRenderer` |
| Section `type` (14 allowed values) | `SECTION_COMPONENTS[type]` mapping |
| Field `key`s per section type | components read exact keys (`hero_headline`, …) |
| Home page containing header+footer sections | renderer lifts them globally |
| `SiteContent`, `SiteImage`, `PublishedSnapshot` shapes | renderer/publish contract |
| `ImageSlot.defaultAsset` path | default image fallback |

### Can Be Redesigned

- `colors.defaultAccent`, `style.*`, `theme.*`
- Section ordering/composition per page
- Which extra pages a template has
- All shared visual output (via `src/shared/site-render/` + `globals.css`)
- `name`, `description`, `screenshot`, demo copy, and the actual image assets

---

## 22. Common Failure Points

These will break a new/redesigned template (each derived from confirmed code behavior):

- **Missing home page / wrong home id** → `homePage()` returns wrong/undefined; header/footer
  never render and nav has no home link.
- **Home page without a `header` section** → no header renders at all (`SiteRenderer` finds
  none).
- **Home page without a `footer` section** → no footer renders at all.
- **Duplicate section `id`s** → React key collisions (`key={section.id}`).
- **Unsupported `section.type`** or a typo → section silently skipped (`SECTION_COMPONENTS[type]`
  undefined → returns null).
- **Field keys that don't match the component** → fields render empty / as placeholders.
- **Incorrect/missing `defaultAsset` path** → `SlotImage` shows a broken image (no runtime
  error, but ugly).
- **Changing a template `id`** → breaks every existing site + snapshot referencing it.
- **Renaming a page `id`** → orphaned content under the old key; `page-shape`/live routes break.
- **A section relying on a count prop (`svcCount`, `itemCount`, …) that is missing** → the
  component defaults to `0` or `3` items, so fewer/mismatched cards render.
- **Not updating `demoContent.ts`** for a new template → preview falls back to generic copy.
- **Setting a `font-family` utility directly on sections** → breaks the `:lang(ar)` font swap
  and the Section-level convention (`globals.css` note).

---

## 23. Validation Checklist

Use this whenever building or redesigning a template.

```
Identity & registration
[ ] Template has a unique, stable id (never change after sites use it)
[ ] Template object is present in the TEMPLATES array (catalog.ts)
[ ] name / description are BilingualText (en + ar)
[ ] colors.defaultAccent is a valid hex
[ ] style/theme use only supported enum values
[ ] rtlValidated is set (true when RTL verified)

Pages
[ ] home page exists with id "home" and slug ""
[ ] about, services, contact pages exist (minimum set)
[ ] Every page id is unique
[ ] Every non-home page has a nav slug (non-empty); home slug is "" (nav optional)
[ ] Extra pages (menu/gallery/faq/hours/pricing/team) follow their page contract

Sections
[ ] home page starts with a "header" section and ends with a "footer" section
[ ] Every section type is one of the 14 supported values
[ ] Every section has a unique id across the template
[ ] Every section's field keys match its component contract (§10)
[ ] Required count props (svcCount/itemCount/faqCount/planCount/memberCount) are consistent
[ ] Image slots use the expected slotId + valid defaultAsset paths

Rendering
[ ] /preview/<id> renders the home page with header + footer
[ ] /preview/<id>/<slug> renders each page
[ ] Header nav lists the expected pages
[ ] Footer renders name, footer_text, nav, copyright
[ ] No broken image slots (defaultAssets resolve)
[ ] Template renders without errors in view mode and edit mode
[ ] Mobile/tablet widths show the hamburger nav and reflow grids
[ ] Arabic (RTL) renders correctly in preview and live
[ ] A generated site with this template publishes successfully and renders live
```

---

## 24. Known Limitations / Open Questions

- **No template-specific components.** Because every template shares one set of section
  components, two templates with the same `theme.key` will have *identical* section layouts —
  only data (fields, images, accents) differs. A truly unique layout currently requires
  editing shared code (affecting all templates). *This is by design, verified from code.*
- **No per-template asset folders referenced by components.** Components reference assets via
  `ImageSlot.defaultAsset` (global `public/templates/...` paths), not a per-template folder
  tree. *Confirmed.*
- **`ThemeKey` vs `fontPair` overlap:** several distinct enum axes (`hero`, `accentRole`,
  `surface`, `theme.key`) independently influence layout; the interactions are only visible
  by reading each section component. *Confirmed by reading sections.*
- **`imagery` ("photo" | "minimal")** does not appear to gate anything in the section
  components (it is declared but the renderer primarily relies on `theme.key`/`surface`).
  *Inferred — could be a future hook or thumbnail-only signal. **Unknown** whether unused.*
- **Unknown:** whether removing a `field` from a section in a *published* snapshot causes
  the live site to break (the snapshot stores its own content copy, so it should be immune).
- **Unknown:** any place that hard-codes template `id`s or page count assumptions that are
  not in the files inspected for this document.

---

## 25. Source Code Reference

```
Template contract (types):
  src/features/templates/types.ts

Template registry & definition builders (THE source of truth for shape):
  src/features/templates/catalog.ts

Template lookup helpers:
  src/features/templates/pages.ts
  src/features/templates/api/list-templates.ts
  src/features/templates/api/update-site-template.ts

Demo/preview copy:
  src/features/templates/lib/demoContent.ts

Renderer:
  src/shared/site-render/SiteRenderer.tsx
  src/shared/site-render/context.ts
  src/shared/site-render/tokens.ts
  src/shared/site-render/internals.tsx
  src/shared/site-render/atoms.tsx

Section components:
  src/shared/site-render/sections/*.tsx      (one per section type)

Site content / images / snapshot model:
  src/features/sites/types.ts
  src/features/sites/lib/content.ts

AI generation driving content from template fields:
  src/features/generation/run-generation.ts
  src/features/generation/lib/prompt-builder.ts
  src/features/generation/lib/field-validation.ts
  src/features/generation/lib/merge-content.ts

Publishing & live rendering:
  src/features/publishing/publish-site.ts
  src/features/publishing/page-shape.ts
  src/features/publishing/components/LiveSitePage.tsx
  src/features/publishing/live-url.ts

Preview route:
  src/app/preview/[templateId]/[[...slug]]/page.tsx

Live routes:
  src/app/live/[slug]/... 

Editor (consumes templates + content, edit mode):
  src/features/editor/components/EditorShell.tsx

Template selection UI:
  src/features/create-wizard/components/TemplatePicker.tsx
  src/features/create-wizard/components/TemplateCard.tsx
  src/features/templates/components/TemplateGallery.tsx
  src/features/templates/components/TemplateThumbnail.tsx

Shared styling:
  src/app/globals.css  (site-heading-*, site-body, site-surface-deep, --brand)
```
