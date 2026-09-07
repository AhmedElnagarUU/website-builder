# Epic 14 — Template Modern Redesign

## Purpose (one line)
Transform the 10 product templates from "technically functional template pages" into "modern, polished, professional websites" by redesigning the section components, giving each template its own design language through extended style data, improving bilingual demo copy, and refreshing preview assets — without rewriting the working rendering engine.

## Why this epic matters
Our product's value proposition is "AI writes your whole website." The template preview (Epic 13's `/preview/<template-id>` surface) is the single strongest sales moment in the product — it is what a non-technical business owner sees before they commit. Today those previews render correct but visually flat pages: every section follows the same skeleton (small accent bar + centered `text-3xl font-bold` heading + a grid of plain cards), the site headings rely on Tailwind's default `font-serif`/`font-sans` rather than our display faces, spacing is cramped, and demo copy is generic ("Demo Business") — the templates read as "generated/basic websites," which directly undermines the product.

The engine is healthy and valuable. This epic works strictly on top of it: it upgrades the **templates' visual identity, section composition, typography, spacing, and demo content** so a user opening a preview thinks "this looks like a real professional website."

## Current state (facts found in the repo)
- 10 templates across 5 categories, built programmatically in `src/features/templates/catalog.ts` via `def()` + section builders, driven by `TemplateStyle { fontPair, radius, imagery }` + `defaultAccent` (types in `src/features/templates/types.ts`).
- The renderer is fully data-driven: `SiteRenderer.tsx` maps `SectionType` → section component, provides `SiteBrandContext` (brandColor), `SiteNavContext`, `SiteStyleContext` (style), `SiteEditModeContext`. Section components receive `{ section, content, businessInfo, images }` (contract in `src/shared/site-render/sections/types.ts`).
- Per-template visual identity today is only `defaultAccent` + `radius`/`imagery`/`fontPair`. There is no per-template palette, type scale, hero variant, or section-composition switch. `src/shared/site-render/tokens.ts` maps style → a handful of utility classes.
- Every content section shares the same skeleton: brand accent bar (`h-1 w-12 rounded-full`) + `text-3xl font-bold` title + a uniform grid of cards (`ServicesSection`, `TestimonialsSection`, `PricingSection`, etc. all follow it).
- Site-render headings use Tailwind default `font-serif`/`font-sans`; the app's display faces (`--font-display`/`--font-serif2`) are not used by sections. Arabic already swaps heading families via `:lang(ar)` in `globals.css`, but section-level family utilities override it.
- Demo content (`src/features/templates/lib/demoContent.ts`, `buildTemplateDemo`) is fully bilingual and complete, but industry-generic: "Demo Business / نشاط تجريبي", generic service/testimonial copy identical across all 10 templates, `origin: "placeholder"`.
- `ContactSection` hardcodes "Tel"/"Email"/"Address" (not localized) — legacy violation to fix in this epic.
- Default imagery is shared per category under `public/templates/real/<category>/*.webp`; previews render them via `defaultAsset` when `images={}` (as `TemplatePreviewShell` does). Per-template thumbnails are hand-made SVGs: `public/templates/<id>/preview.svg`.
- Verification surfaces: `/preview/<template-id>` (and subpages) render live; the editor preview reuses the same `SiteRenderer` with `editMode`.

## Scope boundaries
**In:** design audit + external design research (deliverable `audit-report.md`); an additive style-data extension (`TemplateTheme`) that gives each template a distinct design language; tokens + site typography utilities; redesign of all section components (hero, header, footer, services, about, testimonials, cta, contact, menu, gallery, faq, hours, pricing, team); improved per-template bilingual demo copy; responsive/overflow polish; refreshed `preview.svg` thumbnails; final before→after quality review.
**Out (future):** rewriting the renderer (SiteRenderer, provider nesting, `F`/`SlotImage`, content/build contracts, section→component mapping, edit-mode plumbing); new npm dependencies; new image files (existing `public/templates/real/**` webps are reused — presentation/crop/overlay only); structural/drag-and-drop editing; per-language templates; generating real `screenshot.png` files (thumbnails keep falling back to `preview.svg`).

## Milestones (in order)
1. **01-design-audit** — Audit all 10 templates (visual/structural/content/responsive) + external design research → binding `audit-report.md` and a per-template design-language plan.
2. **02-design-system-foundation** — Add `TemplateTheme` to the style data model; extend `SiteStyleContext`; add site typography + surface utilities; reusable section primitives (section head, CTA band, cards); header/footer consistency.
3. **03-homepage-redesign** — Hero variants per theme + homepage composition per theme + header/logo/mobile-nav chrome.
4. **04-internal-pages-redesign** — About/Services/Contact + extra pages (menu, gallery, faq, hours, pricing, team) with per-theme compositions.
5. **05-content-and-demo-data** — Per-template realistic bilingual (EN+AR) demo copy in `demoContent.ts`.
6. **06-responsive-and-polish** — Responsive/states/overflow validation + fixes; refresh `preview.svg` thumbnails; final quality review (before→after).

## Cross-epic dependencies
- **Epic 13** (`/preview/<template-id>` + `TemplatePreviewShell`) is the primary visual verification surface and must keep working unchanged — the redesign happens in sections/tokens/data, which the shell renders. `TemplatePreviewShell` passes `images={}` so previews automatically use the `real/**` webps.
- Messages: any new user-facing strings (e.g. localized contact labels) go to **both** `src/messages/en.json` and `src/messages/ar.json`.
- Existing published live sites render through the same section components; a design-system upgrade intentionally changes their look too (never their content, save unpublished edits).

## Product invariants (never broken)
- No structural/drag-and-drop editing surface may ever be added; publish and editing remain separate actions; Arabic is a first-class RTL version, never a translation skin.
- No new npm dependencies without human approval (CODE_RULES §4).
- No hardcoded user-facing strings (fix the `ContactSection` Tel/Email/Address legacy in scope).
- Layout must keep RTL-safe: logical utilities only (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`), directional classes never, `rtl:rotate-180` for arrows.
- The engine seam is honored: `SiteRenderer` provider nesting, `F`, `SlotImage`, `SampleTag`, `SectionRenderProps`, `ContentField`, and the section→component mapping are not rewritten. Allowed: widening the `SiteStyleContext` value type (additive), redesigning section-component markup inside their own files, extending `tokens.ts`, adding additive utilities in `globals.css`, and changing template data (`catalog.ts` styles + `demoContent.ts`).
- Edit-mode behaviors must survive redesigned sections: empty-field affordances via `F`, `SlotImage` tap-to-fill, `SampleTag` badges.