# Task — Record pageviews in the live routes

## Title
Server-side pageview recording in the published-site route handlers

## Context
Each render of a published live page should count toward analytics. Recording must be server-side, cheap, non-blocking, and only for *published* sites.

## Scope
Call `recordPageview` from the live page handlers. Keep it best-effort: never block the response, never error the render, and skip obvious non-browser traffic.

## Technical details
- Files: `src/app/live/[slug]/[lang]/page.tsx` and `src/app/live/[slug]/[lang]/[pageSlug]/page.tsx` (Epic 08).
- Derive `siteId` (from `getPublishedSiteBySlug` result), `page` (home or pageSlug), `locale` (lang).
- Only record when the site is published (the resolver already guarantees that). Skip if an obvious bot UA header is present (conservative, e.g. `bot`/`crawler`/`spider`).
- Fire-and-forget: `void recordPageview(...)` (or a queued await after the render has resolved) so a slow/cold write never slows page load; wrap in try/catch to guarantee non-throwing.
- Do NOT count the bare `/live/[slug]` redirect as a pageview (it 302s to home; home records).

## Dependencies
- M01 task 01 (recordPageview). Epic 08 routing.

## Out of scope
- Handling the redirect route. Client-side analytics. Unique visitors.

## Acceptance criteria
- Loading `/live/{slug}/{lang}` and `/live/{slug}/{lang}/{page}` increments the matching (site,date,page,locale) counter.
- Recorded only for published sites; unpublished/404 no-op.
- Pages render normally even if recording fails (no 5xx, no added latency in the happy path).
- Bot UA does not increment.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Local end-to-end: hit live pages, confirm counters.