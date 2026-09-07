# Epic 13 — Full Template Preview Experience

## Purpose (one line)
Replace the small modal "View Template" preview with a realistic full-website preview that opens in a new browser tab — rendering the *actual* template as a complete, multi-page, bilingual, responsive website with demo content — and prepare scalable screenshot infrastructure for template cards.

## Why this epic matters
A template choice is the single biggest design decision a non-technical owner makes. A modal with a small embedded render cannot answer "what will my website actually look and feel like?" This epic replaces the obsolete mini-preview with a real browser-level website experience (navigation, scroll, pages, images, typography, RTL) built from the same `SiteRenderer` + demo-content infrastructure the product already ships with, and reserves a predictable per-template screenshot slot so cards can show real screenshots later without rewriting card components.

## Current state (facts found in the repo)
- Templates are code-defined data: `TemplateDefinition` in `src/features/templates/types.ts` with per-template `pages[]` (header/hero/services/about/testimonials/cta/contact/footer + menu/gallery/faq/hours/pricing/team). Catalog: `src/features/templates/catalog.ts`.
- The renderer `SiteRenderer` (`src/shared/site-render/SiteRenderer.tsx`) already renders a full site for any template + locale + pageId, with container-query responsive layout, nav context, brand color, style system, and real default images via `ImageSlot.defaultAsset`. Used today by the live site (`/live/...`) and the editor.
- Demo content generator already exists: `src/features/templates/lib/demoContent.ts` → `buildTemplateDemo(template, locale)` returns a fullbilingual `content` (all pages, EN+AR) plus a demo `businessInfo` — no real business data required, no S3 images needed (`images: {}` falls back to real `defaultAsset` webps).
- An **obsolete modal preview** exists: `src/features/templates/components/TemplatePreview.tsx` (modal + trigger) wired into `TemplateCard` (create-wizard), `TemplateGalleryCard` (dashboard gallery), and the editor `ChangeTemplateControl` picker. This epic **removes that modal** and replaces the trigger with a new-tab action. Reuses the demo-content library.
- Routing: the app is under `/[locale]`; public non-localized routes bypass intl in `src/middleware.ts` (currently only `/live` bypassed). Preview routes must be added to that bypass.
- Cards show SVG thumbnails from `/templates/{id}/preview.svg` via `TemplateThumbnail` (already has `useState` + `onError` fallback-rendering pattern).

## Scope boundaries

**In:**
- Public preview route(s) rendering the selected template as a real standalone website (demo content, real images, accent color, all pages).
- Real multi-page navigation inside the preview (path-based, natural anchor links) + EN/AR toggle + RTL. Fully responsive (actual renderer, container queries).
- A clearly visible "View template" action on every template card (wizard picker, dashboard gallery, editor picker) that opens the preview in a **new browser tab**.
- Removal of the obsolete modal preview implementation and its message keys; single source of truth = the new-tab preview.
- Screenshot infrastructure: a `screenshot` path on the template definition, a predictable default location per template under `public/templates/<template-id>/`, and cards that consume the configured screenshot (gracefully falling back to the SVG thumbnail while real screenshots do not exist yet).

**Out (future):**
- Creating final template screenshots (the ephemeral SVG thumbnail remains the fallback until they exist).
- Any editing inside the preview, any auth gating of the preview route, SEO promotion beyond basic `noindex` metadata.
- Anything outside the template-selection → preview → card pipeline (no changes to editor rendering, live sites, generation, publishing).

## Milestones (in order)
1. **01-preview-route** — public `/preview/<templateId>/[...page]` route (middleware-exempt, SSG, metadata) rendering any catalog template as a standalone demo website through a `TemplatePreviewShell`.
2. **02-selection-integration** — a new-tab "View template" action on every template card; delete the obsolete modal implementation, update messages.
3. **03-screenshot-infrastructure** — `TemplateDefinition.screenshot` field, catalog defaults at a predictable per-template path, `TemplateThumbnail` screenshot rendering with graceful fallback.

## Cross-epic dependencies
- Depends on **Epic 08** (multi-page templates: `TemplateDefinition.pages`, renderer nav, real default images) and the demo-content library present in the working tree.
- Depends on **Epic 09** surfaces (gallery, editor picker, wizard picker) for where the new-tab action is wired.
- Independent of Epics 10–12 (analytics, monetization, admin).

## Product invariants (never broken)
- No structural/drag-and-drop editing surface anywhere; preview is view-only.
- Publish/edit separation untouched; previews never touch MongoDB or a user's site.
- Arabic preview is a real RTL render, never a translation skin.
- No new npm dependencies. All new user-facing strings go through `en.json`/`ar.json`.