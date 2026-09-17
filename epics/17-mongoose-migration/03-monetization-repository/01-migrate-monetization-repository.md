# Task 01 — Decouple `monetization/types.ts` + Rewrite Monetization Repository

## Objective
Swap `mongodb.ObjectId` for `mongoose.Types.ObjectId` in monetization types, and replace every `db.collection(...)` call in the monetization repository with Mongoose model methods — preserving all return contracts and duplicate-key semantics.

## Dependencies
M01 complete.

## Scope

### `src/features/monetization/types.ts`
- Replace `import type { ObjectId } from "mongodb"` with `import type { Types } from "mongoose"`.
- Replace type references `ObjectId` → `Types.ObjectId` where used (`Subscription._id/userId`, `BillingRecord._id/userId/siteId`, `UpdateSubscriptionPatch`).
- No runtime code changes; these are type-only.

### `src/features/monetization/repository.ts`
- Remove `import { ObjectId } from "mongodb"` and `import { getDb } from "@/shared/db/database"`.
- Import the five models and `mongoose` (for `mongoose.Types.ObjectId`).
- `getSubscriptionForUser` → `SubscriptionModel.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean()`.
- `upsertSubscription` → `SubscriptionModel.findOneAndUpdate({ userId }, { $set: { ...updateDoc } }, { upsert: true, new: true }).lean()`. The `updateDoc` middleware computes `updatedAt: now`; for a fresh insert you must also seed `createdAt` and all optional fields exactly as the current code does (the current code sets the same `$set` body for both branches plus `createdAt` on insert). Use `$setOnInsert: { createdAt: now }` so the semantics are identical. Return the lean doc (shape `Subscription`).
- `getAccountStatus` → `MembershipModel.findOne({ userId }).lean()`. If null → `"active"`, else `doc.accountStatus`.
- `suspendAccount` / `restoreAccount` → `MembershipModel.updateOne({ userId }, { $set: { accountStatus, updatedAt: now }, $setOnInsert: { userId, createdAt: now } }, { upsert: true })` — identical to current behavior. (You may use `findOneAndUpdate` with upsert; do NOT change the semantics: existing record keeps its `createdAt`, new record gets `createdAt: now`.)
- `storePhoneIdentity` → `PhoneIdentityModel.create({ userId, phoneNumber, verifiedAt, createdAt: now })` (mongoose generates `_id`). Catch → `{ success: false, duplicate: err.code === 11000 }`. Verify the thrown error is an `Error` with `.code === 11000` for duplicates (MongoServerError). Keep the same `{ success: boolean, duplicate: boolean }` contract and throw-on-non-duplicate? NOTE: current code RETURNS `{ success: false, duplicate: false }` for non-duplicate errors and logs nothing — replicate exactly (do not throw).
- `findPhoneIdentity` → `PhoneIdentityModel.findOne({ phoneNumber }).lean()`.
- `userExists` → `const found = await UserReadModel.exists({ _id: new mongoose.Types.ObjectId(userId) }); return found !== null;` (does not materialize the doc; read-only).
- `appendBillingRecord` → `BillingModel.create({ ...doc })`.
- `listBillingForUser` → `BillingModel.find({ userId }).sort({ createdAt: -1 }).lean()`.
- `sumBillingForUser` → `BillingModel.aggregate<{ _id: string; totalMinor: number; count: number }>([{ $match: match }, { $group: { _id: "$currency", totalMinor: { $sum: "$amountMinor" }, count: { $sum: 1 } } }])` then the same `.map(...)` to `CurrencyTotal`.

### Preserved behaviors (verify by reading the code before editing)
- `getAccountStatus` treats a missing membership as `"active"`.
- `enforceTrialStatus` calls `getTrialStatus` then possibly `suspendAccount` — unchanged (no edits needed beyond the functions above).
- `resolveSubscriptionForUser` uses `getSubscriptionForUser` + `upsertSubscription` — unchanged.
- `storePhoneIdentity` duplicate semantics with the unique index on `phoneNumber`.

## Acceptance criteria
- Zero `from "mongodb"` imports in `features/monetization/**` (repository, types, lib/usage).
- All exported function signatures from the original file are unchanged.
- `StorePhoneIdentity` returns the same `{ success, duplicate }` shape in all paths.
- `tsc --noEmit` passes; `npm run lint` passes.