# Task — Site and snapshot content per-page

## Title
Change site content, published snapshot, and DTO to per-page shape

## Context
Currently `Site.content` is `{ [locale] : { fieldKey: ContentField } }`. With multi-page, content must be grouped by page so the editor and renderer can load one page at a time and publishing snapshots the full per-page site.

## Scope
Update the persisted site model, the published snapshot, and the DTO to the per-page content shape end-to-end across the repository and the types consumed by the editor/live pages.

## Technical details
- Files: `src/features/sites/types.ts` (types), `src/features/sites/repository.ts` (repository mapping), and every consumer that reads/writes `site.content`.
- New content shape:
  ```ts
  content: Record<string /* pageId */, Record<Locale, Record<string, ContentField>>>
  ```
- `PublishedSnapshot.content` becomes `Record<string /* pageId */, Record<Locale, Record<string, ContentField>>>`.
- Update `toSiteDTO` and all readers (dashboard, editor page, publish, get-published-site) to the new shape.
- Because field keys are globally unique, keep the keys unchanged; only the grouping by page changes.
- Migration from the old flat shape → Home page is M02 (this task only makes the types/shape support both OR completes the switch with migrations addressed in M02). Prefer completing the new shape here and doing the data migration in M02.

## Dependencies
- M01 task 01 (template page types).

## Out of scope
- Renderer changes (M03), generation (M02), editor UI (M05).

## Acceptance criteria
- `npx tsc --noEmit` passes with the new per-page content types wired through repository + DTO + consumers.
- No place still assumes the flat `{ locale: { key } }` shape.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean.
