# Milestone 01 — Page Data Model

## Goal
Introduce the concept of **pages** into the template and site data model so all downstream pieces (generation, renderer, publish, editor) can be per-page.

## Shared context — THE PAGE MODEL (stated once, binding for every task in this epic)
- **`TemplateDefinition`** gains a `pages: TemplatePage[]`. Each `TemplatePage`:
  - `id: string` (stable, e.g. `"home"`, `"about"`, `"services"`, `"contact"`, `"menu"`, `"gallery"`, `"faq"`, `"pricing"`, `"team"`, `"hours"`)
  - `slug: string` (URL segment; `home` maps to `''`/root, others to their own path)
  - `name: BilingualText` (nav label)
  - `sections: TemplateSection[]`
  - `nav: boolean` (whether it appears in the main nav; Home is implied nav).
- The **header and footer are shared across all pages** — they are no longer "sections of a single page" but site chrome. Keep the existing `header`/`footer` section types available for page sections that need them, but the rendered site renders shared header + current page's sections + shared footer.
- **Content becomes per-page:** `Site.content` and `PublishedSnapshot.content` change from `{ locale: { fieldKey: ContentField } }` to `{ pageId: { locale: { fieldKey: ContentField } } }`. Field keys stay globally unique (the semantic-key registry already keeps them unique across the template, so only one page may "own" a given key).
- `SiteRenderer` renders a single `(pageId)` at a time instead of all sections.
- Existing flat content = the **Home** page after migration (Milestone 02).

## Tasks
1. **01-template-page-types** — add `TemplatePage` + `pages` to `TemplateDefinition`; update `types.ts`.
2. **02-site-and-snapshot-content-per-page** — update `Site.content`, `PublishedSnapshot`, DTO, and Mongo schema shape to per-page.
3. **03-catalog-page-model** — refactor `catalog.ts` so the 10 templates build page lists (Home + About/Services/Contact as the baseline page set; template-specific extras added in Milestone 04).
