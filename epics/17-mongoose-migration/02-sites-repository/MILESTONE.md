# Milestone 02 — Migrate Sites Repository to Mongoose

## Goal
Replace all native `db.collection<Site>(...)` calls in `features/sites/repository.ts` with the Mongoose `SiteModel`, while preserving every exported function signature, runtime return shape (via `.lean()`), `maybeMigrateContent` behavior, and the `toSiteDTO` output. Also migrate the native `countDocuments` call in `features/monetization/lib/usage.ts`.

## Tasks (execution order)
1. **01-migrate-sites-repository.md** — repository + usage.ts rewrite.

## Shared context (binding for this milestone)
- `src/features/sites/site.schema.ts` exports `SiteModel` (M01). Use `.lean()` on all reads.
- `src/features/sites/types.ts` — `Site`, `SiteDTO`, `CreateSiteInput`, `UpdateSitePatch` — DO NOT change any of these types.
- Native `updateSite` semantics: `findOneAndUpdate({_id}, {$set: {...}}, { returnDocument: "after" })` → Mongoose `findOneAndUpdate({_id}, {$set: {...}}, { new: true }).lean()`.
- `maybeMigrateContent(site)` writes back with `$set: { content, updatedAt: new Date() }` — keep identical, via `SiteModel.updateOne`.
- `features/monetization/lib/usage.ts:getUsageForUser()` currently uses `db.collection("sites").countDocuments({ ownerId, "generation.startedAt": { $gte: startOfToday } })` → `SiteModel.countDocuments(...)`.

## Verification (end of milestone)
- No `from "mongodb"` import remains in `features/sites/repository.ts` or `features/monetization/lib/usage.ts`.
- `tsc --noEmit` passes; `npm run lint` passes.
- Site CRUD still behaves identically (see M05 runtime checks for final confirmation).