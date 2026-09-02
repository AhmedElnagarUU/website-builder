# Milestone 02 — Analytics Dashboard

## Goal
Show the owner how their published site performs: total pageviews, per-page breakdown, and a simple 7/30-day trend — owner-scoped, beautiful, bilingual.

## Shared context
- Data comes from M01's `listSitePageviewDays`. Optionally expose a read API route, or render server-side directly from the dashboard page (preferred — the dashboard page is already a server component `src/app/[locale]/dashboard/page.tsx`).
- Scope strictly to the owner: use `requireSession`/`getSiteForOwner` so a user can only see their own sites' analytics.
- Copy must be honest: these are **pageview counts**, not unique visitors (that's documented as a known limitation; no third-party analytics).

## Tasks
1. **01-analytics-read-route-or-query** — owner-scoped read path (server query + optional `GET` route) returning totals/per-page/trend.
2. **02-analytics-dashboard-view** — UI on the dashboard per site (cards): total views, views per page (EN/AR), 7/30-day mini trend; empty state; staggered loading-safe.