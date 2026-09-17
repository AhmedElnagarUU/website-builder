# Milestone 04 — Migrate Analytics Repository to Mongoose

## Goal
Replace all native `db.collection<PageviewDay>("pageviews")` calls in `features/analytics/repository.ts` with the Mongoose `PageviewModel`, and decouple `features/analytics/types.ts` from `mongodb`. Preserve all function signatures and the `$inc` upsert behavior.

## Tasks (execution order)
1. **01-migrate-analytics-repository.md** — types decoupling + repository rewrite.

## Shared context (binding for this milestone)
- `pageview.schema.ts` exports `PageviewModel` (M01). Use `.lean()` on reads.
- `recordPageview` semantics: `updateOne({ siteId, date, page, locale }, { $inc: { views: 1 } }, { upsert: true })` — view counts are incremented atomically; default `views: 1` on first insert. Mongoose `PageviewModel.updateOne(...)` supports the identical call.
- `listSitePageviewDays`: builds a query object with optional `$gte`/`$lte` string date range → `find(query).lean()`.
- `deleteSitePageviews` → `PageviewModel.deleteMany({ siteId })`.

## Verification (end of milestone)
- Zero `from "mongodb"` imports in `features/analytics/**`.
- `tsc --noEmit` passes; `npm run lint` passes.