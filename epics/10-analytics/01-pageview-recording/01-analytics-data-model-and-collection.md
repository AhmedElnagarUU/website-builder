# Task — Analytics data model and atomic pageview recording

## Title
Add the analytics collection and an atomic `recordPageview` helper

## Context
We track pageviews in-house in MongoDB. To keep the DB small and queries fast, we aggregate daily per site/page/locale and increment atomically.

## Scope
Create the analytics persistence layer: a collection (or model), the daily-counter shape, and a single `recordPageview` function with an atomic upsert.

## Technical details
- Files: create `src/features/analytics/types.ts` and `src/features/analytics/repository.ts` (mirroring existing repository patterns; use the repo's Mongo client — see `src/shared/db`).
- Shape:
  ```ts
  interface PageviewDay {
    siteId: ObjectId;         // published site
    date: string;             // "YYYY-MM-DD" (UTC)
    page: string;             // "home" | pageSlug from Epic 08
    locale: "en" | "ar";      // lang segment
    views: number;
  }
  ```
  Unique index on `{ siteId, date, page, locale }`.
- `recordPageview({ siteId, date, page, locale })` → Mongo `updateOne(..., { $inc: { views: 1 } }, { upsert: true })`, fire-and-forget friendly (should not raise).
- Also a `listSitePageviewDays(siteId, fromDate?, toDate?)` query helper for M02.

## Dependencies
- Epic 08 routing (page slugs). Mongo singleton already in repo.

## Out of scope
- Recording in routes (M02). Dashboard UI (M02). Unique visitors / sessions / third-party.

## Acceptance criteria
- Upsert increments the right (site,date,page,locale) counter atomically under concurrent hits (verify two parallel increments → +2).
- Missing-day rows are created on first hit; query helper returns rows bounded by date range.
- No new dependency.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean.