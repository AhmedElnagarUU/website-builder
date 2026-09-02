# Task — Render the active page with shared header/footer and active nav

## Title
Update SiteRenderer to render one page at a time with shared chrome and active navigation

## Context
With multi-page templates, a site is no longer one long page. The renderer must draw the shared header (nav), the current page's sections, and the shared footer, and highlight the active page in the nav (in edit mode and live).

## Scope
Refactor `SiteRenderer` to accept a `pageId` (current page) plus the page-aware content, and render shared header + that page's sections + shared footer. Highlight the active page in nav. Keep it a single component used by both editor and live.

## Technical details
- Files: `src/shared/site-render/SiteRenderer.tsx` and the header section `src/shared/site-render/sections/HeaderSection.tsx`.
- Signature change: add `pageId: string`; content passed is `content[pageId]`. Keep existing props (template, locale, images, brandColor, editMode, callbacks, s3PublicBaseUrl).
- Header nav renders links from `template.pages` (labels from `page.name[locale]`) using relative page slugs; the active page is highlighted.
- Header/footer are rendered once at site scope (not repeated per page).
- Must keep the mobile menu working (Epic 07 M02) and the opaque background (Epic 07 M01).

## Dependencies
- Epic 07 (fidelity + navbar mobile). M01 page model; M02 routing.

## Out of scope
- New section types (task 02). Content generation (M02). Editor per-page UI (M05).

## Acceptance criteria
- Rendering with a given `pageId` shows shared header/footer and only that page's sections.
- Active nav item is highlighted; clicking a nav link resolves to the correct page segment.
- Editor preview and live site look identical.
- EN + AR (RTL) correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
