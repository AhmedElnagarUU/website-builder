# Milestone 03 — Multi-Page Renderer & Navigation

## Goal
Render exactly one page at a time with a shared header/footer and active-nav highlighting, and add the new page-oriented section types so multi-page sites look correct.

## Shared context
- `SiteRenderer` currently maps every `template.sections` linearly. It must instead render: shared `header` (with navigation) → current page's `sections` → shared `footer`.
- Because `header`/`footer` are shared site chrome, the template's pages may reference a shared header/footer definition (keep the existing `header`/`footer` section types available for snippet usage, but the canonical header/footer live once at site scope).
- All new section types reuse the existing per-section component style in `src/shared/site-render/sections/*` and the semantic-key registry for fields/image slots.

## Tasks
1. **01-render-active-page** — SiteRenderer renders shared header + current page sections + shared footer with active-nav state.
2. **02-new-page-sections** — add section types: menu, gallery, faq, hours, pricing, team; each with fields + image slots in the registry, and renderer components.
