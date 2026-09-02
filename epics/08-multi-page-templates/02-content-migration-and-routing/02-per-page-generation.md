# Task — Per-page AI content generation

## Title
Generate content per page (Home, About, Services, Contact, …)

## Context
The AI generation flow currently produces one page's worth of content from the business brief. With multi-page templates, it must produce per-page content for every page in the chosen template, scoped by each page's sections and fields.

## Scope
Update the generation module (`src/features/generation/*`) so it yields `content[pageId][locale][fieldKey]` for every page, using the semantic-key registry as the per-page field source of truth. Keep model `gemini-3.6-flash` and the existing timeout/schema-handling patterns.

## Technical details
- Files: `src/features/generation/*` (prompt building + parsing + persistence). Reference the AI provider config used in the current implementation (Google Gemini).
- Build one generation scope per page from `template.pages[].sections[].fields[]`, filtered to that page. The Home page keeps hero/headline; About keeps about text; Services keeps service list; Contact keeps contact; template-specific pages in M04 get their own copy blocks.
- Persist into `content[pageId][locale]`. Preserve the existing `ContentField` (origin: "ai", edited: false).
- Both `en` and `ar` are generated first-class (Arabic as a real RTL version, never a translation skin).
- Respect `TIMEOUT_MS = 180s` and the existing generation-status polling contract.

## Dependencies
- M01 tasks 02 & 03 (per-page content types + catalog pages). Migration M02 task 01.

## Out of scope
- New section types / design (M04). Live routing (M02 task 03). Editor per-page UI (M05).

## Acceptance criteria
- Generating a site produces content for every page in the template, keyed correctly under `content[pageId]`, in both locales.
- Fields not owned by a page are not generated into it (no cross-page leakage).
- Generation status API unchanged from the consumers' perspective.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. End-to-end generation smoke-tested for one EN+AR site.
