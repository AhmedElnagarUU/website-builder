# Task — Clean Monetization Role Models

## Title
Remove the admin-only surface from the monetization feature: admin API modules, admin repository fns, the `AdminRole` type, and the `role` field — without touching the app's account-status gating.

## Context
`src/features/monetization/` mixes user-facing subscription/billing code with admin primitives. This task strips only the admin side, keeping `AccountStatus`/`getAccountStatus` functional (the paywall depends on them).

## Scope
- **Delete modules** (verify standalone / admin-only callers first via grep):
  - `src/features/monetization/lib/admin-auth.ts`
  - `src/features/monetization/api/admin-set-subscription.ts`
  - `src/features/monetization/api/admin-record-payment.ts`
- **`src/features/monetization/types.ts`**: remove `export type AdminRole = "user" | "super_admin";` and the `role?: AdminRole` field from the `Membership` interface (keep `accountStatus` and `AccountStatus`).
- **`src/features/monetization/repository.ts`**: remove `getAdminRole`, `adminSetSubscription`, and `listBillingByAdmin`; remove the `role` field from the membership mapping/shape wherever it appears. **Keep** `getAccountStatus` (used by entitlement/paywall) and `ensureAllUsersHaveFreePlan` (not admin-only — confirm its caller before removing; if it is only used by admin startup code, note that decision in your report and remove it). For `setAccountStatus`: check callers — if its only caller was the deleted `/api/admin/users/[userId]/status` route, remove it; otherwise keep.
- Sweep the rest of `src/` for any remaining references (`super_admin`, `AdminRole`, `getAdminRole`, `setAdminSubscription`, modifiers like `isAdmin`) and remove orphaned imports.

## Dependencies
CODE_RULES.md; task 01 (admin API/UI already deleted); M05 shared context.

## Out of scope
Deploying the future admin app; data migrations (`admin_audit`, `billing` collections, existing `memberships.role` values stay in Mongo); the `subscriptions`/`billing` user-facing read functions.

## Acceptance criteria
1. Grep of `src/` for `AdminRole|super_admin|getAdminRole|isAdmin|requireAdmin` returns nothing.
2. `AccountStatus` + `getAccountStatus` still exist and `src/features/monetization/lib/entitlement.ts` / `checkLimit.ts` still use them unchanged (paywall gating intact).
3. Subscription/billing reads (`listBillingForUser`, `sumBillingForUser`, `appendBillingRecord`) that the app actually uses still compile.
4. `tsc --noEmit` + `npm run lint` pass.