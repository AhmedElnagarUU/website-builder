# Task — Live multi-page routing

## Title
Serve each page at its own live URL with per-page publish

## Context
Live sites must expose each page at a distinct URL: home at `/live/[slug]/[lang]` and other pages at `/live/[slug]/[lang]/[pageSlug]`. The publish snapshot now contains all pages, and publish should commit them while preserving the explicit re-publish invariant.

## Scope
Update live routing, URL helpers, and the publish action for multi-page. Internal nav links between pages become relative page-segment links.

## Technical details
- Files:
  - `src/app/live/[slug]/[lang]/page.tsx` — renders Home; add `src/app/live/[slug]/[lang]/[pageSlug]/page.tsx` for other pages.
  - `src/features/publishing/live-url.ts` — `nextUrl(slug, pageSlug?, host?)` producing page-aware URLs.
  - `src/features/publishing/publish-site.ts` — snapshot includes `content[pageId][locale]`; remains the single writer of `slug`; idempotent re-publish preserved.
  - `src/features/publishing/get-published-site.ts` — expose per-page content (validates `pageSlug` exists in the snapshot's template).
- `generateMetadata` per page (title/description from that page's fields; canonical includes page segment).
- 404 when a requested page isn't in the snapshot's template.
- Nav links rendered from `template.pages` use relative page segments (RTL-safe).

## Dependencies
- M02 tasks 01 & 02; M03 renderer (for shared header/footer + active nav) to fully look right, but routing can be wired here.

## Out of scope
- Analytics tracking (Epic 10). Template picker (Epic 09). Editor per-page (M05).

## Acceptance criteria
- `GET /live/{slug}` redirects to home; `/live/{slug}/{lang}` shows Home; `/live/{slug}/{lang}/{pageSlug}` shows that page for a known page, 404 for unknown.
- Publishing stores and serves all pages; re-publishing still requires explicit confirmation and never silently overwrites.
- Both EN and AR, with correct canonical/OG per page.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Live end-to-end smoke-tested for a 2-page+ site across EN/AR and publish/unpublish.
