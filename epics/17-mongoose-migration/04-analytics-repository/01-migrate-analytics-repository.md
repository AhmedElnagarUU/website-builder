# Task 01 — Decouple `analytics/types.ts` + Rewrite Analytics Repository

## Objective
Swap `mongodb.ObjectId` for `mongoose.Types.ObjectId` in analytics types, and replace every `db.collection<PageviewDay>` call with the Mongoose `PageviewModel` — preserving upsert, range-query, and deleteMany behavior.

## Dependencies
M01 complete.

## Scope

### `src/features/analytics/types.ts`
- Replace `import type { ObjectId } from "mongodb"` with `import type { Types } from "mongoose"`.
- Replace `ObjectId` in `PageviewDay.siteId` → `Types.ObjectId`.
- No runtime changes (type-only).

### `src/features/analytics/repository.ts`
- Remove `import { ObjectId } from "mongodb"` and `import { getDb } from "@/shared/db/database"`.
- Import `PageviewModel` from `./pageview.schema` and `mongoose` for `mongoose.Types.ObjectId`.
- `toObjectId` helper → keep but source ObjectId from mongoose (or inline `new mongoose.Types.ObjectId(...)`).
- `recordPageview(input)` → `await PageviewModel.updateOne({ siteId, date, page, locale }, { $inc: { views: 1 } }, { upsert: true })`.
- `listSitePageviewDays(siteId, fromDate?, toDate?)` → build the same dateRange query, `PageviewModel.find(query).lean()`.
- `deleteSitePageviews(siteId)` → `PageviewModel.deleteMany({ siteId })`.

## Acceptance criteria
- Zero `from "mongodb"` imports in `features/analytics/**`.
- Exported function signatures unchanged.
- `$inc`/upsert and date-range semantics identical.
- `tsc --noEmit` passes; `npm run lint` passes.