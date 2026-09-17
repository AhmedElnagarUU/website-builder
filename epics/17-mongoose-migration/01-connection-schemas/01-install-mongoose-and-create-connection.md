# Task 01 — Install Mongoose + Connection Singleton + Define All Schemas

## Objective
Add `mongoose` (approved dependency), create a dev-hot-reload-safe Mongoose connection singleton, and define one schema/model file per app-owned collection. Do NOT modify any repository yet.

## Dependencies
None — first task of Epic 17.

## Scope

### Step 1 — Install
```bash
npm install mongoose
```
Choose a Mongoose version compatible with the existing project (Node/Next 15). Verify after install that `npx tsc --noEmit` still passes before proceeding.

### Step 2 — Connection singleton: `src/shared/db/mongoose.ts`
- Reads `MONGODB_URI` and `MONGODB_DB_NAME` from env (fail loudly if missing, same pattern as `client.ts`).
- Uses a module-level cached connection; in development reuse a `global` cached value to survive hot reload (same pattern as `src/shared/db/client.ts`).
- Exports `getMongooseConnection(): Promise<mongoose.Connection>`.
- Models are obtained via `mongoose.models.<Name> ?? mongoose.model(...)` (or a per-connection registry) to avoid `OverwriteModelError`.
- On first connect, ensure indexes exist. Prefer relying on mongoose `autoIndex` (default) OR call `Model.init()` explicitly for each model once — pick one approach and document it in a short comment-free way (KISS).

### Step 3 — Schema/model files (one per collection, in the owning feature folder)

**`src/features/sites/site.schema.ts`** — collection `sites`
- `ownerId`: ObjectId, required
- `status`: String enum `["draft","published","unpublished"]`, required, default `"draft"`
- `currentStep`: String enum `["business_info","templates","language","generating","editing"]`, required, default `"business_info"`
- `businessInfo`: subdoc with `name` (String, required), `category` (String enum of `CATEGORIES`, required), optional strings `description`, `targetCustomers`, `services`, `location`, `contactPhone`, `contactEmail`, and optional string arrays `usps`, `notes`
- `templateId`: String, optional
- `languagesRequested`: [String], default `[]`
- `activeLanguages`: [String], default `[]`
- `content`: Mixed, default `{}`
- `images`: Mixed, default `{}`
- `brandColor`: String, default `""`
- `slug`: String, sparse (optional), unique index `{ slug: 1 } { unique: true, sparse: true }`
- `publishedSnapshot`: Mixed, default `null` (may be null or an object)
- `hasUnpublishedChanges`: Boolean, default `false`
- `generation`: subdoc `{ status: String enum ["idle","queued","running","complete","failed"] default "idle", error: String optional, startedAt: Date optional, finishedAt: Date optional }`
- `createdAt`: Date, required, default `Date.now`
- `updatedAt`: Date, required, default `Date.now`
- `timestamps: false`
- idx: `{ ownerId: 1 }`
- Export `SiteModel`.

**`src/features/analytics/pageview.schema.ts`** — collection `pageviews`
- `siteId`: ObjectId, required
- `date`: String, required (YYYY-MM-DD)
- `page`: String, required
- `locale`: String enum `["en","ar"]`, required
- `views`: Number, required, default `1`
- `timestamps: false`
- idx: `{ siteId: 1, date: 1, page: 1, locale: 1 } { unique: true }`
- Export `PageviewModel`.

**`src/features/monetization/subscription.schema.ts`** — collection `subscriptions`
- `userId`: ObjectId, required
- `planId`: String enum `["free","pro"]`, required
- `status`: String enum `["active","trialing","past_due","canceled","ended"]`, required
- `provider`: String, optional
- `providerSubscriptionId`: String, optional
- `currency`: String, optional
- `amountMinorUnits`: Number, optional
- `currentPeriodStart`: Date, optional
- `currentPeriodEnd`: Date, optional
- `trialEndsAt`: Date, optional
- `cancelAtPeriodEnd`: Boolean, optional
- `createdAt` / `updatedAt`: Date, required
- `timestamps: false`
- idx: `{ userId: 1 } { unique: true }`
- Export `SubscriptionModel`.

**`src/features/monetization/membership.schema.ts`** — collection `memberships`
- `userId`: ObjectId, required
- `accountStatus`: String enum `["active","suspended","frozen"]`, required
- `createdAt` / `updatedAt`: Date, required
- `timestamps: false`
- idx: `{ userId: 1 } { unique: true }`
- Export `MembershipModel`.

**`src/features/monetization/billing.schema.ts`** — collection `billing`
- `userId`: ObjectId, required
- `siteId`: ObjectId, optional
- `kind`: String enum `["manual_payment","manual_discount","write_off","gateway_charge","gateway_refund","credit"]`, required
- `amountMinor`: Number, required
- `currency`: String, required
- `description`: String, optional
- `provider`: String, optional
- `providerEventId`: String, optional
- `createdBy`: String, required
- `createdAt`: Date, required
- `timestamps: false`
- idx: `{ userId: 1, createdAt: -1 }`, `{ createdBy: 1, createdAt: -1 }`, `{ providerEventId: 1 } { unique: true, sparse: true }`
- Export `BillingModel`.

**`src/features/monetization/phone-identity.schema.ts`** — collection `phoneIdentities`
- `userId`: ObjectId, required
- `phoneNumber`: String, required
- `verifiedAt`: Date, required
- `createdAt`: Date, required
- `timestamps: false`
- idx: `{ phoneNumber: 1 } { unique: true }`
- Export `PhoneIdentityModel`.

**`src/features/monetization/user.schema.ts`** — collection `user` (better-auth-owned, READ-ONLY)
- `strict: false` (must be able to read arbitrary better-auth fields without error)
- No required fields (not writing anything)
- No indexes
- Export `UserReadModel`.

### Step 4 — Update `src/shared/db/database.ts`
- `getDb()` and `getMongoClient()` stay for better-auth. Remove the `ensureIndexes(cachedDb)` call and the `indexes` import (mongoose handles indexes now).

### Step 5 — Delete `src/shared/db/indexes.ts`
Indexes now live in the schemas. Deleting the file must not remove any index from the actual database — mongoose will create equivalent ones.

## New files created
- `src/shared/db/mongoose.ts`
- `src/features/sites/site.schema.ts`
- `src/features/analytics/pageview.schema.ts`
- `src/features/monetization/subscription.schema.ts`
- `src/features/monetization/membership.schema.ts`
- `src/features/monetization/billing.schema.ts`
- `src/features/monetization/phone-identity.schema.ts`
- `src/features/monetization/user.schema.ts`

## Files modified
- `package.json` (+ `mongoose`)
- `src/shared/db/database.ts` (remove ensureIndexes)

## Files deleted
- `src/shared/db/indexes.ts`

## Acceptance criteria
- `mongoose` is in `package.json` dependencies.
- `npx tsc --noEmit` passes; `npm run lint` passes.
- Every schema mirrors its corresponding type interface (compare fields/types manually).
- Every index from the deleted `indexes.ts` is reproduced as a schema index.
- `getDb()` still exported from `database.ts`; `shared/auth/server.ts` untouched.
- `getMongooseConnection()` exists and reuses one connection across calls (module + global cache in dev).
- `UserReadModel` uses `strict: false` on collection `user`.