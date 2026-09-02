# Milestone 01 — Pageview Recording

## Goal
Record a pageview server-side for every rendered page of a *published* live site, stored in MongoDB in a compact, queryable shape.

## Shared context
- Recording happens on the **server** in the `/live/...` route handlers (they already resolve the site via `getPublishedSiteBySlug`). No client-side script is used. This counts raw loads (including bots/refreshes) — acceptable for a first in-house version; keep it honest in the UI copy.
- Multi-page comes from Epic 08: `/live/[slug]/[lang]/[pageSlug]`. Records should carry the page (home or pageSlug) and locale so the dashboard can break down per page/lang.
- Storage shape (aggregated daily counters, not one row per hit) keeps the DB lean:
  ```ts
  { siteId, date: "YYYY-MM-DD", page: "home" | pageSlug, locale: "en"|"ar", views: number }
  ```
  updated with a single atomic `$inc` upsert per hit.

## Tasks
1. **01-analytics-data-model-and-collection** — collection + `recordPageview` helper with atomic upsert.
2. **02-server-side-recording-in-live-routes** — call `recordPageview` in the live page handlers for published sites only (with a light dedupe/debounce guard, e.g. ignore obvious bot UA or fire-and-forget, no blocking renders).