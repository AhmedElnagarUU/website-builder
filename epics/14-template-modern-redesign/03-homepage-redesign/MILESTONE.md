# Milestone 03 — Homepage Redesign

## Goal
Give each template family a deliberate, professional homepage: distinct hero variants, a composed section flow (not "title → cards → CTA"), and theme-aware chrome — turning the preview home page into the product's strongest showcase.

## Tasks (execution order)
1. **01-hero-and-chrome.md** — Hero variants (`photo-bleed`, `split-light`, `split-deep`) + header/logo/mobile-nav polish.
2. **02-homepage-composition.md** — Homepage section flow per family using M02 primitives (social proof, features/services, stats, testimonials, FAQ, CTA).

## Shared context (binding for this milestone)
- Everything composes from the primitives in `02-design-system-foundation` (`SectionHead`, `CtaBand`, `SiteCard`, `StatBlock`) and reads `useSiteStyle().theme`. Do not re-implement primitive behavior inline.
- Homepage structure is defined by `catalog.ts` `buildPages`: home = `[header, hero, (testimonials), cta, footer]`. M03 may NOT add/drop/rename sections or field keys, and must not change `svcCount`/testimonial counts per template unless the audit explicitly calls for it (ordered by the orchestrator, not self-authorized).
- The five families and their heroes (from the M01 binding table): `corporate` (light/serif/split-light), `bold` (deep/sans/split-deep), `warm` (light/serif/photo-bleed), `retail` (light/sans/split-light or photo-bleed per template), `creative` (light or deep/sans/split-light or photo-bleed per template).
- `HeroSection` is the only section with a layout switch today (`imagery`). M03 replaces that logic with theme-driven hero variants; keep `imagery` field intact for data compat but hero layout keys off `theme.hero`.
- Typographic roles (hero/section/sub/body/label) come from the audit's scale; headings use `.site-heading-*`, body `.site-body`.
- `SlotImage`/`F` usage and edit-mode affordances must survive: do not change their contracts; hero split variants keep the `hero_image` slot reachable.
- Hero imagery reuses existing `public/templates/real/<category>/hero.webp` (no new files; cropping/position/overlay allowed via existing slot handling).
- Preview verification surface: `/preview/<template-id>` per family. Build rule per M02 MILESTONE.md.