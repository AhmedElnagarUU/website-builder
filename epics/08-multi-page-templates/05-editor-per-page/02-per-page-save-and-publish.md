# Task — Per-page save, publish, and safe regeneration

## Title
Persist per-page content, publish all pages, and keep regeneration from overwriting edits

## Context
Content is now per-page. Save must reconcile per-page changes, publish must commit all pages, and AI regeneration (Epic 02/03 flow) must never overwrite manually edited fields — a core product invariant.

## Scope
Ensure server persistence, publish, and regeneration all operate on the per-page model while honoring the invariance rules.

## Technical details
- `SaveProvider` / autosave: persist `content[pageId][locale][fieldKey]` for the active page (e.g. via `PATCH /api/sites/[siteId]/content` or the existing save route extended with `pageId`).
- Publish (`src/features/publishing/publish-site.ts`): build `PublishedSnapshot.content[pageId][locale]` from all pages; keep explicit confirmation + unique-slug behavior.
- Regenerate (`src/features/generation/*` + `RegenerateSiteControl`): regenerate only AI-originated fields and only for the current page's AI scope; never touch `edited:true` fields (merge, not replace). Preserve the confirmation/planning the current flow already shows.
- Update `record-image-slot` / image PATCH so image slots are resolved against the correct page (slot lookup searches all pages).

## Dependencies
- M05 task 01. M02 (routing/migration). M01 types.

## Out of scope
- Analytics (Epic 10). Template picker (Epic 09). Editor visuals beyond the page selector.

## Acceptance criteria
- Edits on one page persist without affecting other pages' saved content.
- Publish stores and serves all pages; re-publish remains explicit and confirmed.
- Regenerate never overwrites `edited:true` fields; AI-only untouched fields may be regenerated on the current page.
- Draft/live drift indicator reflects the correct unpublished-state across pages.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. End-to-end smoke test: edit 2 pages → publish → verify live; edit → verify drift → re-publish → verify.
