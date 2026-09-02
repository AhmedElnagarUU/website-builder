# Task — Owner-scoped analytics read path

## Title
Add the owner-scoped read query/route for analytics summary data

## Context
The dashboard needs dashboard-ready analytics: totals, per-page counts, and a small trend series — for the requesting owner's sites only.

## Scope
Add a read API under the analytics feature: a server query (returning prepared buckets) and an API route for on-demand refresh, both enforcing ownership.

## Technical details
- Files: `src/features/analytics/repository.ts` (add summary query), `src/features/analytics/api/get-site-analytics.ts` (owner check + aggregation), and `GET /api/sites/[siteId]/analytics` (`src/app/api/sites/[siteId]/analytics/route.ts`).
- Response shape (all numbers bounded to the last N days):
  ```ts
  {
    totalViews: number,
    last7Days: number,
    last30Days: number,
    perPage: { page: string, locale: string, views: number }[],
    trend: { date: string, views: number }[],   // last 30 days daily totals
  }
  ```
- Ownership enforced: `getSiteForOwner(siteId, session.user.id)` → 404 if not the owner; 401 unauthenticated.
- Locale page names resolved to labels from the template on the client (so raw page slugs stay canonical).

## Dependencies
- M01 tasks 01 & 02.

## Out of scope
- Dashboard UI (task 02). Unique visitors.

## Acceptance criteria
- Only the owner can read a site's analytics (401 unauthenticated / 404 foreign).
- Response returns totals + per-page + trend; page slugs canonical; numbers >= 0.
- No new dependency.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean.