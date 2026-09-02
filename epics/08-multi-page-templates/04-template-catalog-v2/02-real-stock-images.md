# Task — Real stock imagery replacing SVG placeholders

## Title
Replace SVG placeholder default assets with real photographic images per category

## Context
Current templates use flat SVG placeholders (`public/templates/defaults/<category>/*.svg`) as default assets for logo/hero/gallery slots. Real images dramatically raise perceived quality. Image slots map by category via `logoSlot`/`heroImageSlot`/`gallerySlot` in `catalog.ts` (`defaultAsset`).

## Scope
Replace default slot assets with real images. Decide a licensing-safe approach and deliver working assets grouped by category.

## Technical details
- Files: `src/features/templates/catalog.ts` (defaultAsset paths) + new assets under `public/templates/real/<category>/*.webp` (or similar), and update the SVG defaults accordingly where still used.
- **No new npm dependency and no runtime third-party fetch.** Source publicly-licensed imagery (e.g. Unsplash-style license / a vendored static set) and store locally; add attribution/notes in the repo doc if required by license.
- Preserve slot `aspectRatio` and `minWidth`/`minHeight` so the upload validation and low-res warning still work.
- The image system must still allow the owner to replace defaults via S3 upload (that flow is unchanged here).
- Keep both EN/AR sites identical visually (images are language-neutral).

## Dependencies
- M04 task 01 (page sets reference the slots).

## Out of scope
- S3 upload backend defect (deferred). Image-upload popup UX redesign (Epic 09). Design polish layout (task 03).

## Acceptance criteria
- Logo/hero/gallery slots render real photographic images by category in editor and live, EN and AR.
- Aspect-ratio/min-dimension metadata still hold; no broken-image references.
- No new dependency; assets are local and used offline at render time.

## Definition of Done
- `CODE_RULES.md` read and followed; license-safe assets committed.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
