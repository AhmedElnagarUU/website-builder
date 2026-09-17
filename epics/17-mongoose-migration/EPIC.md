# Epic 17 — MongoDB Native Driver → Mongoose

## Purpose (one line)
Migrate all application-owned MongoDB collections from the native `mongodb` driver to Mongoose schemas/models, establishing explicit data contracts with validation, defaults, and indexes — while preserving better-auth's native-driver boundary and keeping all existing application behavior identical.

## Why this epic matters
Data access today is raw `db.collection<T>().find/insertOne/updateOne` calls. The only "schema" is a TypeScript interface that is never enforced at runtime — a malformed or missing field silently reaches the API layer. Mongoose adds a runtime boundary: documents pass through schemas that validate and default fields, and indexes become declarative parts of the model. This migration is a requirement of the architecture-modernization mission (`prompt/refactor.md`): **Epic A — MongoDB native driver → Mongoose**, with the primary goal of explicit, centralized data models and predictable structure (types, validation, defaults, indexes).

## Current state (facts verified in the repo before authoring this epic)

### Connection layer
- `src/shared/db/client.ts` — `MongoClient` singleton (dev hot-reload safe via `global._mongoClient`); env vars `MONGODB_URI` + `MONGODB_DB_NAME`.
- `src/shared/db/database.ts` — `getDb()` cached; calls `ensureIndexes()` once on first use.
- `src/shared/db/indexes.ts` — `ensureIndexes(db)` creates indexes for: `sites` (ownerId, slug unique sparse), `pageviews` (compound unique), `subscriptions` (userId unique), `memberships` (userId unique), `billing` (3 indexes), `phoneIdentities` (phoneNumber unique).
- `src/shared/auth/server.ts` — better-auth uses `mongodbAdapter(getDb())` → it owns collections `user`, `session`, `account`, `verification`, `otp` (phone plugin). The adapter requires the native `mongodb` package.
- `src/app/api/health/route.ts` — pings via `getMongoClient()`.
- **Consequence:** `shared/db/client.ts` + `shared/db/database.ts` MUST remain for the better-auth boundary. Mongoose gets its own connection (own pool) to the same DB.

### Collections (app-owned, currently native driver)

| Collection | Repository | Key operations | Key indexes |
|---|---|---|---|
| `sites` | `features/sites/repository.ts` | CRUD (create, get by ID/owner/slug, update, delete, list by owner) | `{ownerId:1}`, `{slug:1} unique sparse` |
| `pageviews` | `features/analytics/repository.ts` | upsert ($inc), range query, deleteMany | `{siteId, date, page, locale} unique` |
| `subscriptions` | `features/monetization/repository.ts` | findOne, upsert/updateOne by userId | `{userId} unique` |
| `memberships` | `features/monetization/repository.ts` | findOne, upsert/updateOne by userId | `{userId} unique` |
| `billing` | `features/monetization/repository.ts` | insert, list by userId (sort), aggregate ($match/$group) | `{userId, createdAt}`, `{createdBy, createdAt}`, `{providerEventId} unique sparse` |
| `phoneIdentities` | `features/monetization/repository.ts` | insertOne (11000-catch race safety), findOne by phone | `{phoneNumber} unique` |
| `user` (READ-ONLY) | `features/monetization/repository.ts:userExists()` | exists/projection only | — (better-auth owns it) |

### Special behaviors that MUST be preserved
- `features/publishing/publish-site.ts` catches `MongoError` code **11000** for slug duplicate-key retry (`MAX_SLUG_RETRIES = 3`).
- `features/sites/repository.ts:maybeMigrateContent()` — migrates legacy flat content format **in-place** (writes back to DB); called on every site read path.
- `features/monetization/repository.ts:storePhoneIdentity()` catches **11000** to distinguish duplicate phone numbers (race-safe OTP).
- `features/monetization/lib/usage.ts:getUsageForUser()` — native `countDocuments` on `sites` (`generation.startedAt` today).
- `updateSite()` uses `findOneAndUpdate` with `returnDocument: "after"` → Mongoose `{ new: true }`.
- Billing aggregation pipeline: `[{ $match }, { $group: { _id: "$currency", totalMinor: { $sum: "$amountMinor" }, count: { $sum: 1 } } }]`.

### Files importing the native `mongodb` package (inventory, from grep)
- `features/sites/types.ts` (type-only `ObjectId`), `features/sites/repository.ts`
- `features/analytics/types.ts` (type-only), `features/analytics/repository.ts`
- `features/monetization/types.ts` (type-only), `features/monetization/repository.ts`, `features/monetization/lib/usage.ts`
- `features/publishing/publish-site.ts` (runtime `MongoError`)
- `shared/db/client.ts`, `shared/db/database.ts`, `shared/db/indexes.ts` (infra)
- `shared/auth/server.ts` (better-auth adapter)
- `app/api/health/route.ts` (runtime `getMongoClient`)

## Design decisions (binding, embedded in tasks)
1. **Schemas live inside owning feature folders** — `features/sites/site.schema.ts`, `features/analytics/pageview.schema.ts`, `features/monetization/*.schema.ts`. Respects feature-based ownership (CODE_RULES §2); no global `models/` folder.
2. **`site.content` and `site.images` use `Schema.Types.Mixed`** — deeply nested locale→page→field→content maps are too volatile to fully schematize; strict mode stays ON for top-level fields (unknown top-level fields are stripped on write).
3. **Explicit timestamps (`timestamps: false`)** — `Site`, `Subscription`, `Membership` already manage `createdAt`/`updatedAt` manually; keep exactly that behavior.
4. **`.lean()` everywhere on reads** — preserves existing plain-object shapes so `toSiteDTO()`, `maybeMigrateContent()`, and all callers keep working with zero serializer changes.
5. **better-auth boundary stays native** — `shared/db/client.ts` + `database.ts` remain untouched; `app/api/health/route.ts` migrates to a Mongoose ping; `userExists()` moves to a read-only Mongoose model on collection `user` with `strict: false`.
6. **Duplicate-key handling** — `publish-site.ts` uses a code-only `isDuplicateKeyError()` guard (checks `.code === 11000`, no `MongoError` import). Mongoose surfaces duplicate key as `MongoServerError` whose `.code` is also `11000`, so the guard works for both.
7. **Indexes defined in schemas** — `schema.index(...)` mirrors every index in `shared/db/indexes.ts`; mongoose auto-creates them (`autoIndex` default true) and the old `ensureIndexes` call/file is removed.
8. **No destructive data migration** — existing documents already match the modeled shapes; `maybeMigrateContent()` is preserved as-is (it must keep writing back via Mongoose update).
9. **Two connection pools** — native `MongoClient` (better-auth) and Mongoose connection (app data) both target the same DB. Documented trade-off; do not attempt to share one client.
10. **`mongoose.Types.ObjectId` replaces `mongodb.ObjectId`** in feature types (compile-time only swap; `mongoose.Types.ObjectId` is compatible with stored ObjectIds).

## Scope boundaries
**In:** install `mongoose` (approved); Mongoose connection singleton in `shared/db/`; 7 schema/model files; rewrite of the three repositories + `usage.ts`; health-route migration; `MongoError` isolation in `publish-site.ts`; deletion of `indexes.ts`; removal of all `mongodb` imports from feature code (types + runtime).
**Out:** touching better-auth collections or adapter; redesigning business logic; changing API/DTO contracts; the AI generation flow (that's Epic 18); any new dependency beyond `mongoose`; any test framework; the pending `newmodern/` reskin; changes to existing site content or data.

## Milestones (execution order)
1. **01-connection-schemas** — Install `mongoose`; create connection singleton (`shared/db/mongoose.ts`); define all 7 schemas; remove `ensureIndexes` from `database.ts`; delete `indexes.ts`.
2. **02-sites-repository** — Rewrite `features/sites/repository.ts` + `features/monetization/lib/usage.ts` to `SiteModel`; keep `maybeMigrateContent` + `toSiteDTO` behavior.
3. **03-monetization-repository** — Rewrite `features/monetization/repository.ts` to the four monetization models + read-only `UserReadModel`; decouple `monetization/types.ts` from `mongodb`.
4. **04-analytics-repository** — Rewrite `features/analytics/repository.ts` + decouple `analytics/types.ts`.
5. **05-cleanup-validation** — Migrate health route to Mongoose; isolate `MongoError` in `publish-site.ts`; verify zero `mongodb` imports in `src/features/**`; full tsc + lint + build + runtime checks.

## Cross-epic dependencies
- Epic 18 (LangChain) touches only `features/generation/**`. Epic 17 does not touch that folder. The two epics are independent; Epic 17 runs first only to keep build/verification sequential (one build at a time).
- The `user` read-only model depends on better-auth's `user` collection existing — it already does; no action needed.

## Product invariants (never broken)
- better-auth adapter keeps using the native `mongodb` driver through the existing singleton — no changes to `shared/db/client.ts`, `shared/db/database.ts`, `shared/auth/server.ts`.
- All API response shapes (`SiteDTO` etc.) and routes stay byte-identical.
- Duplicate-key semantics (slug retry in publish, phone-identity race safety) preserved.
- `maybeMigrateContent()` still runs on every site read.
- Build rule: never build while dev server runs; stop :3000, delete `.next`, run `npm run build` plainly, restart via `start-dev.bat`, verify `/api/health`.