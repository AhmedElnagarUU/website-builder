# Milestone 03 — Migrate Monetization Repository to Mongoose

## Goal
Replace all native `db.collection(...)` calls in `features/monetization/repository.ts` with the four monetization Mongoose models + the read-only `UserReadModel`. Preserve every exported function signature, runtime shape, and the duplicate-key behavior in `storePhoneIdentity`. Decouple `features/monetization/types.ts` from the `mongodb` package.

## Tasks (execution order)
1. **01-migrate-monetization-repository.md** — types.ts decoupling + repository rewrite.

## Shared context (binding for this milestone)
- Models from M01: `SubscriptionModel`, `MembershipModel`, `BillingModel`, `PhoneIdentityModel`, `UserReadModel` (all in `features/monetization/*.schema.ts`).
- `src/features/monetization/types.ts` currently imports `import type { ObjectId } from "mongodb"` and uses `ObjectId` in `Subscription`, `BillingRecord`, `UpdateSubscriptionPatch`. These are compile-time-only types — swap to `import type { Types } from "mongoose"` and use `Types.ObjectId` (compatible with stored ObjectIds). Do NOT change any runtime shape.
- `storePhoneIdentity` semantics: `insertOne` catching error whose `.code === 11000` → `{ success: false, duplicate: true }`. Mongoose propagates duplicate-key as `MongoServerError` with `.code === 11000` — the same check works; verify it.
- `suspendAccount` / `restoreAccount` semantics: `updateOne` with `$set` + `$setOnInsert: { userId, createdAt }`, `{ upsert: true }` → Mongoose `findOneAndUpdate(..., { upsert: true, new: true })` (or `updateOne` with upsert + `$setOnInsert` — choose the one that keeps behavior identical).
- `upsertSubscription` semantics: check existing by userId → update with `$set` (no `$setOnInsert` for new) → fetch back. Mongoose `findOneAndUpdate(..., { upsert: true, new: true })` reproduces this in one call.
- Billing aggregation: `[{ $match: { userId, createdAt? } }, { $group: { _id: "$currency", totalMinor: { $sum: "$amountMinor" }, count: { $sum: 1 } } }]` — identical syntax under `BillingModel.aggregate(...)`.
- `userExists(userId)`: `UserReadModel.exists({ _id: new mongoose.Types.ObjectId(userId) })` returns a truthy id object or null.
- README on the read-only model: `user` is owned by better-auth; the app only reads it via `UserReadModel`.

## Verification (end of milestone)
- Zero `from "mongodb"` imports in `features/monetization/**` (types.ts + repository.ts + lib/usage.ts).
- `tsc --noEmit` passes; `npm run lint` passes.
- `storePhoneIdentity`/`suspendAccount`/`restoreAccount`/`upsertSubscription` behavior preserved (verified at runtime in M05).