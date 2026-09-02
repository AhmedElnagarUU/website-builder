# Task — Subscription record and user migration

## Title
Add the Subscription model + account status, and backfill users onto Free

## Context
To gate anything, every user needs a subscription (plan + status) and an account status. Existing users have neither, so we add them and migrate everyone to an active Free plan.

## Scope
Create the `Subscription` Mongo model/repository and add `accountStatus` to the user model (via better-auth or a side collection), defaulting `active`. Backfill existing users to active Free subscriptions.

## Technical details
- Files: new `src/features/monetization/types.ts`, `repository.ts`, plus wiring into the existing user model. Where users live: better-auth accounts/sessions — check `src/shared/auth/*`; do NOT add columns blindly; add account status in a way consistent with the existing auth integration (likely a companion `memberships`/`accounts` doc keyed by `userId`, or an extension of the better-auth user).
- `Subscription` repository: `getSubscriptionForUser(userId)`, `upsertSubscription(...)`, `setAccountStatus(userId, status)`, and a backfill helper `ensureAllUsersHaveFreePlan()` that creates active Free subscriptions and `active` account status for any user missing them.
- Use integer minor-units discipline for any money fields now (they arrive in M04; design the types to hold `currency` + minor units).
- Idempotent: running backfill twice does not duplicate.

## Dependencies
- M01 task 01 (plan definitions). Epic 01 (auth/user model).

## Out of scope
- Guard engine (M02). Gating (M03). Ledger records (M04). Admin UI (Epic 12).

## Acceptance criteria
- Every user resolves to an active Free subscription (missing → created on read).
- `accountStatus` defaults to `active`; not breaking sign-in/sign-up.
- Backfill idempotent; no duplicate subscriptions.
- `npx tsc --noEmit` passes and sign-in/up still work.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- ESLint clean; typecheck passes; auth smoke-tested.
