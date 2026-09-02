# Task — Migrate existing flat content into the Home page

## Title
Idempotently migrate pre-multi-page flat content into the Home page

## Context
Sites produced before the multi-page change stored content flat (`content[locale][fieldKey]`). After M01 the shape is per-page (`content[pageId][locale][fieldKey]`). Existing owners must keep their content, mapped to the Home page, without data loss or duplication.

## Scope
A read-time / write-path migration that detects the legacy flat shape, maps it to `content.home`, and persists the migrated form. Must be idempotent and never overwrite newer per-page data.

## Technical details
- Files: `src/features/sites/repository.ts` (or a dedicated `src/features/sites/lib/migrate-content.ts`).
- Detection: a site whose `content` has the flat shape (locale keys at the top level, or a marker) is legacy.
- Migration: `content.home = { ...old flat content }`; other pages start empty. Persist once; subsequent reads see the new shape.
- Do NOT overwrite if `content.home` already exists.
- Run the migration as part of the normal load path (`toSiteDTO` / `getSiteForOwner`) so it self-heals on next access, and (optionally) via a small script for existing rows.

## Dependencies
- M01 task 02 (per-page content types).

## Out of scope
- Populating non-Home pages (owner will generate/edit). Generation → M02 task 02.

## Acceptance criteria
- A legacy flat-content site, after load, has its original fields under `content.home` per locale, with no loss, and the shape is persisted.
- Running the load again does not duplicate or corrupt (idempotent).
- A new per-page site is untouched.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Handles RTL/Arabic content unchanged.
