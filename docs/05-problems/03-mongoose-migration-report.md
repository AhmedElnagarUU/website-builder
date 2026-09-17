# Epic 17 — Mongoose Migration Report

## Summary
Migrated all application-owned MongoDB collections from raw native-driver access
(`db.collection<T>(...).find/insertOne/updateOne/...`) to Mongoose schemas/models with
runtime validation, defaults, and declarative indexes — per Mission 03 / Epic A
(native driver → Mongoose). better-auth keeps full ownership of `user`, `session`,
`account`, `verification`, `otp` via the native `mongodbAdapter`; those collections are
touched only through the untouched `shared/db/client.ts` + `shared/db/database.ts` +
`shared/auth/server.ts` boundary. Two connection pools target the same DB by design
(EPIC.md decision 9). No data migration or backfill was needed — existing documents
match the modeled shapes; the legacy flat-content migration (`maybeMigrateContent`)
is preserved and still runs on every site read.

## MongoDB → Mongoose

### Collections migrated (app-owned)
| Collection | Model | Repository |
|---|---|---|
| `sites` | `SiteModel` | `features/sites/repository.ts`, `monetization/lib/usage.ts` |
| `pageviews` | `PageviewModel` | `features/analytics/repository.ts` |
| `subscriptions` | `SubscriptionModel` | `features/monetization/repository.ts` |
| `memberships` | `MembershipModel` | `features/monetization/repository.ts` |
| `billing` | `BillingModel` | `features/monetization/repository.ts` |
| `phoneIdentities` | `PhoneIdentityModel` | `features/monetization/repository.ts` |
| `user` (READ-ONLY) | `UserReadModel` (strict:false, collection `user`) | `features/monetization/repository.ts` (`userExists`) |

### Models/schemas created
- `src/features/sites/site.schema.ts`
- `src/features/analytics/pageview.schema.ts`
- `src/features/monetization/subscription.schema.ts`
- `src/features/monetization/membership.schema.ts`
- `src/features/monetization/billing.schema.ts`
- `src/features/monetization/phone-identity.schema.ts`
- `src/features/monetization/user.schema.ts`

### Repositories changed
- `src/features/sites/repository.ts` — all CRUD via `SiteModel`, `.lean()` on every read,
  `new mongoose.Types.ObjectId(...)` for ids, `maybeMigrateContent` write-back via
  `SiteModel.updateOne`, `findOneAndUpdate({ new: true })` for `updateSite`.
- `src/features/monetization/lib/usage.ts` — `SiteModel.countDocuments(...)` for
  `aiGenerationsToday`.
- `src/features/monetization/repository.ts` — five Mongoose models; `upsertSubscription`
  via `findOneAndUpdate({ upsert: true, new: true, $setOnInsert })`; `suspendAccount`/
  `restoreAccount` keep `$set` + `$setOnInsert` + upsert (existing record keeps its
  `createdAt`, new record gets `createdAt: now`); `storePhoneIdentity` keeps the exact
  `{ success, duplicate }` contract with `code === 11000` detection (MongoServerError
  surfaces dups with the same `.code`).
- `src/features/analytics/repository.ts` — `PageviewModel.updateOne` `$inc` upsert,
  range `find` with `.lean()`, `deleteMany` — identical semantics.

### Types decoupled from `mongodb` (type-only, `mongoose.Types.ObjectId`)
- `src/features/sites/types.ts`
- `src/features/analytics/types.ts`
- `src/features/monetization/types.ts`

### Validation introduced
- Enums: site `status`/`currentStep`, pageview `locale`, subscription `planId`/`status`,
  billing `kind`, membership `accountStatus`, generation `status`.
- `required` on core fields (ownerId, status, currentStep, createdAt/updatedAt,
  views, userId, planId, accountStatus, amountMinor, currency, createdBy, phoneNumber,
  verifiedAt).
- Defaults: status/currentStep, `content: {}`, `images: {}`, `brandColor`, views: 1,
  generation status "idle".
- Indexes (mirror of the deleted `shared/db/indexes.ts`, now schema-declared and
  auto-created by Mongoose):
  - `sites`: `{ownerId:1}`, `{slug:1}` unique sparse
  - `pageviews`: `{siteId,date,page,locale}` unique
  - `subscriptions`: `{userId}` unique
  - `memberships`: `{userId}` unique
  - `billing`: `{userId,createdAt:-1}`, `{createdBy,createdAt:-1}`,
    `{providerEventId}` unique sparse
  - `phoneIdentities`: `{phoneNumber}` unique

### Legacy data findings
- Deeply nested `site.content` and `site.images` kept as `Schema.Types.Mixed` — too
  volatile to fully schematize; strict mode stays on for top-level fields.
- `site.publishedSnapshot` kept as `Mixed` (object or null).
- `maybeMigrateContent()` (flat → deep content) preserved byte-for-byte and still runs
  on every site read.
- No backfill performed; existing docs already match the modeled shapes.

### Remaining native `mongodb` usage (justified boundary)
- `src/shared/db/client.ts` — `MongoClient` singleton used by better-auth adapter.
- `src/shared/db/database.ts` — `getDb()` returning native `Db` for the adapter.
- `src/shared/auth/server.ts` — `mongodbAdapter(getDb())` (no literal `from "mongodb"`
  import; reaches the driver via `database.ts`).
- Reason: better-auth's adapter requires the native driver and must keep its own pool.
  Mongoose owns a separate pool (EPIC.md decision 9). Touching these files is out of
  scope per product invariant.

## Files Changed
Added:
- `src/shared/db/mongoose.ts` (connection singleton + `getModel` helper; dev hot-reload
  safe via `global._mongooseConnectionPromise`)
- `src/features/sites/site.schema.ts`
- `src/features/analytics/pageview.schema.ts`
- `src/features/monetization/{subscription,membership,billing,phone-identity,user}.schema.ts`

Modified:
- `package.json` / `package-lock.json` — added `mongoose` (^8.24.4, approved)
- `src/shared/db/database.ts` — removed `ensureIndexes` call + import
- `src/features/sites/repository.ts`
- `src/features/monetization/lib/usage.ts`
- `src/features/monetization/repository.ts`
- `src/features/analytics/repository.ts`
- `src/features/sites/types.ts`, `src/features/analytics/types.ts`, `src/features/monetization/types.ts`
- `src/app/api/health/route.ts` — Mongoose connection ping (`conn.db!.admin().command({ ping: 1 })`)
- `src/features/publishing/publish-site.ts` — `MongoError` import removed; inline
  `isDuplicateKeyError()` code guard (`.code === 11000`) for the slug retry loop

Deleted:
- `src/shared/db/indexes.ts` (indexes now live in the schemas; equivalent indexes are
  auto-created by Mongoose; no existing index was removed from the DB)

## Validation (actual results)
| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0, "No ESLint warnings or errors" |
| `npm run build` (from clean `.next`, dev servers stopped) | passed — 33/33 static pages, full route table |
| `GET /api/health` (dev server, `start-dev.bat`) | 200 `{ "status": "ok", "db": true }` |
| `GET /en` | 200 |
| `GET /ar` | 200 |
| `GET /en/auth/sign-in` | 200 (better-auth adapter boots through `getDb()`) |
| `grep -r 'from "mongodb"' src/` | exactly `src/shared/db/client.ts` and `src/shared/db/database.ts` (auth/server.ts reaches the driver via `database.ts`; no literal import) |
| Zero native imports in `src/features/**` | confirmed |
| Publish slug-retry path | not exercised at runtime (no publish flow driven end-to-end in this environment); the code guard compiles and the `isDuplicateKeyError` logic is a straightforward `.code === 11000` check identical to the native behavior |

Notes
- Runtime spot-checks ran against `http://localhost:3000` — this environment's `.env`
  and `start-dev.bat` use port 3000 (the epic criteria referenced 3001; that port is
  only a different local convention).
- `/en` returned 200 on the second request; the first request timed out due to the dev
  server's on-demand page compile, not an application error.

## Risks / Follow-up
- **Two connection pools** to the same DB (native for better-auth, Mongoose for app
  data) — an accepted, documented trade-off. No sharing was attempted (EPIC.md #9).
- **Mongoose strict mode on `$set` updates** strips unknown top-level patch fields.
  `UpdateSitePatch` values are typed, so behavior is unchanged for current callers;
  worth remembering for future ad-hoc updates.
- **Dev hot reload**: models resolve through `getModel()` (per-model registry guard),
  preventing `OverwriteModelError` under Next.js fast-refresh.
- **Environment quirk found during validation**: `next/font` fetches to
  `fonts.googleapis.com` timed out because Node preferred the AAAA (IPv6) record in
  this dual-stack network. Build/dev runs here need `NODE_OPTIONS=--dns-result-order=ipv4first`
  set (no code change was made for this).
- **Runtime publish-path check skipped** (no feasible end-to-end site creation/publish
  in this environment). Slug duplicate-key semantics preserved by the code-only guard;
  a manual publish smoke test is recommended before release.
- `src/shared/auth/client.ts` (better-auth client URL fallback) carries a pre-existing
  unrelated uncommitted change for local dev on :3000 — untouched by this epic.

## Final Status
COMPLETED_WITH_FOLLOW_UP
(All milestones M01–M05 implemented and verified — tsc/lint/build/runtime green. The
status is not pure COMPLETED only because (1) the publish slug-retry path was not
exercised end-to-end and (2) the `ipv4first` build-environment workaround should be
codified (e.g. in `start-dev.bat`/a `.env`-adjacent note) before CI runs `npm run build`
in this network.)