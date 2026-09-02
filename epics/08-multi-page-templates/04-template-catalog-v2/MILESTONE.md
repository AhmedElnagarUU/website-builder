# Milestone 04 — Template Catalog v2: Default Pages, Real Images, Design Polish

## Goal
Give every template a meaningful default page set (Home always plus About/Services/Contact and category-specific extras like Menu/Gallery/Pricing/FAQ/Team/Hours), real photographic imagery instead of SVG placeholders, and a distinctive design pass so templates no longer look generic.

## Shared context
- Existing templates (10) live in `src/features/templates/catalog.ts` with SVG default assets in `public/templates/defaults/<category>/*.svg` (see `logoSlot`/`heroImageSlot`/`gallerySlot`).
- **Real images:** replace SVG defaults with tasteful real imagery. Self-host under `public/templates/real/<category>/…` (or reference a royalty-free static set). **No new runtime dependency** and no network-dependency at render time (SERVER/CLIENT must not fetch images from a third party at runtime). Keep `minWidth`/`minHeight`/`aspectRatio` per slot.
- Design pass: distinct visual identity per template (typography via existing `fontPair`, radius, imagery, accent color) — use the repo's vexa design tokens and the `frontend-design` skill.
- Both EN/AR first-class and RTL-safe.

## Tasks
1. **01-default-pages-per-template** — assign a default page set to each of the 10 templates using the new section types.
2. **02-real-stock-images** — replace SVG placeholder defaults with real imagery category-by-category.
3. **03-design-polish-pass** — strengthen each template's visual design (composition, spacing, imagery, typography) while keeping the shared component system.
