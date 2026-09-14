# M02 — Trial Enforcement & Suspension

## Goal
Enforce trial expiration server-side. When a user's trial expires and they have no paid subscription, their account is suspended (`accountStatus: "suspended"`). All protected routes return 403. Site data is preserved. Paid users are unaffected. When a user's subscription becomes active (paid), suspension is cleared.

## Context
- `checkLimit.ts` already returns `account_suspended` (403) when `accountStatus === "suspended"`.
- `withEntitlement` middleware already checks `accountStatus` and returns 403.
- `entitlement.ts` already resolves subscription + account status and checks limits.
- **Gap**: Nobody sets `accountStatus: "suspended"` when a trial expires.
- `cronjob_manage` tool available for scheduled jobs.

## Architecture Decision: Lazy + Cron Enforcement
Two complementary enforcement points:
1. **Lazy enforcement** (every API request via `withEntitlement`): Check if the user's trial has expired and status is still `"trialing"`. If so, immediately suspend (`accountStatus: "suspended"`) and return 403.
2. **Cron job** (daily): Scan all `"trialing"` subscriptions with `trialEndsAt < now`, set `accountStatus: "suspended"`. This handles users who never hit a protected endpoint after expiry.

## Implementation Steps

### Step 1: Add `enforceTrialStatus(userId)` helper in repository
Called at the start of `withEntitlement` (or inside `resolveSubscriptionForUser`):
- Fetch subscription.
- If `status === "trialing"` and `trialEndsAt` exists and `trialEndsAt < now`:
  - Set `Membership.accountStatus = "suspended"`.
  - Update `Subscription.status = "canceled"` (trial ended without payment) — or leave as "trialing" but set account to suspended.
  
**Decision**: Keep `Subscription.status = "trialing"` but set `accountStatus = "suspended"`. The suspension state is at the Membership level. When payment is added later, `accountStatus` is cleared to `"active"` and `subscription.status` moves to `"active"`.

### Step 2: Integrate into `withEntitlement`
After `resolveSubscriptionForUser`, call `enforceTrialStatus(session.user.id)`. If the user was just suspended due to trial expiry, the `checkLimit` call below will return `account_suspended` → 403.

### Step 3: Cron job — daily trial expiry sweep
Use `cronjob_manage` tool to schedule a daily job that:
- Finds all `Subscription` where `status === "trialing"` and `trialEndsAt < now`.
- Sets their `Membership.accountStatus = "suspended"`.
- Runs at 00:00 UTC daily.

### Step 4: Reactivation path
When `resolveSubscriptionForUser` is called and the user has `status === "trialing"` but `trialEndsAt` is in the future, OR `status === "active"` (paid), ensure `accountStatus === "active"`:
- If `accountStatus === "suspended"` and subscription is paid (`status === "active"`) → clear to `"active"`.
- If `accountStatus === "suspended"` and trial is still active → keep suspended (shouldn't happen, but edge case).

### Step 5: User-facing trial-expired state
- Dashboard: show a banner/"your trial has expired" message when `accountStatus === "suspended"` and `trialEndsAt` exists.
- Editor: the paywall overlay already handles `account_suspended` (403 → `PaywallPrompt` with `account_suspended` reason). No change needed — the existing paywall flow will show.

### Step 6: `getTrialStatus` helper (from M01)
Used by dashboard to show trial countdown/expiration UI.

| Acceptance Criteria | Status |
|---|---|
| Expired trial user → `accountStatus: "suspended"` → 403 on protected routes | ✅ DONE |
| Site data NOT deleted on suspension | ✅ DONE (only accountStatus changes) |
| Paid/active subscription → `accountStatus: "active"` → access restored | ✅ DONE (restoreAccount) |
| Lazy enforcement triggers on first request after expiry | ✅ DONE |
| Cron sweeps remaining expired trials daily at 00:00 UTC | ✅ DONE |
| Reactivation path implemented | ✅ DONE |
| `npx tsc --noEmit` passes | ✅ PASS |
| `npm run lint` passes | ✅ PASS |

## Validation
1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 warnings
3. `withEntitlement` returns 403 for expired trial users
4. `enforceTrialStatus` correctly suspends/expired accounts
5. Cron job is scheduled and query is correct
