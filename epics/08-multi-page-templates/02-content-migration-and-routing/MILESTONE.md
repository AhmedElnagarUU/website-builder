# Milestone 02 — Content Migration, Per-Page Generation & Live Routing

## Goal
Make content multi-page end-to-end: migrate existing flat content into Home, generate each page's content, and serve each page at its own live URL.

## Shared context
- **Migration:** sites created before this epic stored flat `content[locale][fieldKey]`. On read, if a site is still in flat form, treat it as the **Home** page (move to `content.home[locale][fieldKey]`) and leave other pages empty so the owner can generate/populate them. Keep the migration idempotent (never duplicate).
- **Generation:** the Gemini generation (`src/features/generation/*`, model `gemini-3.6-flash`) must produce content per page. Each page gets its own prompt scope; the Home page keeps the headline/hero, other pages get their own copy. Field-key registry stays the source of truth per page.
- **Routing:** live URLs become `/live/[slug]/[lang]` (home) and `/live/[slug]/[lang]/[pageSlug]` (other pages). The bare `/live/[slug]` still redirects to home. `nextUrl` should offer optional page segments. Mobile-friendly internal links use relative page segments.
- The publish snapshot now includes all pages (set by publish from per-page content). Re-publish remains explicit (Epic 06 invariant).

## Tasks
1. **01-flat-content-migration** — idempotent migration of existing flat content → Home page.
2. **02-per-page-generation** — generation endpoint produces per-page content.
3. **03-live-multi-page-routing** — `/live/[slug]/[lang]/[pageSlug]` routes + `nextUrl` page segments + publish commits all pages.
