# Task 01 — Rewrite `features/sites/repository.ts` (+ usage.ts) to Use Mongoose

## Objective
Replace every `db.collection<Site>("sites").<op>()` call with the equivalent `SiteModel` query. Exported function signatures, return shapes, and legacy-content migration behavior must remain identical.

## Dependencies
M01 complete: `SiteModel` exists and the connection singleton is established.

## Scope

### `src/features/sites/repository.ts`
- Remove `import { ObjectId } from "mongodb"` and `import { getDb } from "@/shared/db/database"`.
- Import `SiteModel` from `./site.schema`.
- `toObjectId(id)` — keep the helper, change the ObjectId source to mongoose: `new mongoose.Types.ObjectId(id)` (import `mongoose` or `{ Types }` from `mongoose`).
- `maybeMigrateContent(site)` — unchanged logic; the write-back uses `SiteModel.updateOne({ _id: site._id }, { $set: { content, updatedAt: new Date() } })`. Return shape stays `{ ...site, content }`.
- `toSiteDTO(site)` — unchanged (lean docs are plain objects with `_id`/`ownerId` as ObjectId and Dates as Date; the existing `.toString()` / `.toISOString()` calls keep working).
- `createSite(input)` — `SiteModel.create({ ...doc })` (creates `_id` automatically). Return `{ _id: newDoc._id, ...doc }` or the created doc cast to `Site`.
- `getSiteById(id)` — `SiteModel.findById(toObjectId(id)).lean()` → `doc ? maybeMigrateContent(doc as Site) : null`.
- `getSiteForOwner(id, ownerId)` — `SiteModel.findOne({ _id: toObjectId(id), ownerId: toObjectId(ownerId) }).lean()`.
- `getSiteBySlug(slug)` — `SiteModel.findOne({ slug }).lean()`.
- `updateSite(id, patch)` — `SiteModel.findOneAndUpdate({ _id }, { $set: { ...rest, updatedAt: new Date() } }, { new: true }).lean()` → returns `Site | null` (cast result).
- `listSitesByOwner(ownerId)` — `SiteModel.find({ ownerId: toObjectId(ownerId) }).lean()` then map each through `maybeMigrateContent`.
- `deleteSite(id)` — `SiteModel.deleteOne({ _id })` → `result.deletedCount === 1`.

### `src/features/monetization/lib/usage.ts`
- Remove `import { ObjectId } from "mongodb"` and `import { getDb } from "@/shared/db/database"`.
- Import `SiteModel` from `@/features/sites/site.schema` and a mongoose ObjectId.
- `const aiGenerationsToday = await SiteModel.countDocuments({ ownerId: ownerOid, "generation.startedAt": { $gte: startOfToday } })`.
- Keep the rest of the function byte-identical.

## Acceptance criteria
- Zero `from "mongodb"` imports in `features/sites/repository.ts` and `features/monetization/lib/usage.ts`.
- `maybeMigrateContent` still runs on EVERY site read (the `doc ? maybeMigrateContent(doc) : null` pattern preserved).
- `toSiteDTO` output shape unchanged (validated by `tsc` since `SiteDTO` type is untouched).
- `tsc --noEmit` passes; `npm run lint` passes.