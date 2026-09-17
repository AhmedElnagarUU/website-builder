# Milestone 01 — Mongoose Connection + Schemas

## Goal
Install `mongoose`, create a dev-hot-reload-safe Mongoose connection singleton in `shared/db/`, and define Mongoose schemas/models for every app-owned collection — each schema accurately reflecting the existing TS interfaces and the current `shared/db/indexes.ts`. No repository changes in this milestone.

## Tasks (execution order)
1. **01-install-mongoose-and-create-connection.md** — install + connection singleton + all schema model files + index.ts removal.

## Shared context (binding for this milestone)
- Existing types to mirror: `src/features/sites/types.ts` (`Site`, `SiteBusinessInfo`, `SiteContent`, `SiteImage`, `PublishedSnapshot`, `SiteGeneration`, `WizardStep`, `CategoryId`, `Locale`), `src/features/analytics/types.ts` (`PageviewDay`), `src/features/monetization/types.ts` (`Subscription`, `BillingRecord`, `AccountStatus`, `PaymentProvider`, `BillingKind`, `SubscriptionStatus`, `PlanId`), and inline `Membership` + `PhoneIdentity` in `src/features/monetization/repository.ts`.
- Indexes to reproduce exactly (from `src/shared/db/indexes.ts`): sites `{ownerId:1}` + `{slug:1}` unique sparse; pageviews `{siteId,date,page,locale}` unique; subscriptions `{userId}` unique; memberships `{userId}` unique; billing `{userId,createdAt:-1}`, `{createdBy,createdAt:-1}`, `{providerEventId}` unique sparse; phoneIdentities `{phoneNumber}` unique.
- `content` / `images` / `publishedSnapshot` on `Site` are deeply nested → `Schema.Types.Mixed`.
- Timestamps are managed explicitly by the repository (create sets `now`, update sets `updatedAt`) → **`timestamps: false` on every schema**, identical to current behavior.
- Better-auth's `user` collection: read-only model, `strict: false`, no required fields beyond `_id`.
- Models must be cached on the mongoose connection/global to avoid `OverwriteModelError` under dev hot reload.

## Verification (end of milestone)
- `mongoose` in `package.json` dependencies (approved).
- `npx tsc --noEmit` passes; `npm run lint` passes.
- Every index in the deleted `indexes.ts` exists as a schema index.
- `getDb()` still exported & working (better-auth boundary untouched).
- `shared/db/indexes.ts` deleted; `database.ts` no longer calls `ensureIndexes`.
- Destructive check: no data is read/written beyond mongoose's automatic index creation.