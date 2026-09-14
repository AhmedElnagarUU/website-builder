# EPIC-20 — Monetization: 15-Day Free Trial & Subscription Enforcement

## Purpose
Introduce a deterministic 15-day free trial + subscription enforcement layer that gates product access. Every new user gets a free trial of the Free plan. When the trial expires with no paid subscription, the user's sites are **suspended (not deleted)**. Paid/active users are never affected.

## Why This Matters
The monetization foundation exists (Epic 11): `Subscription` with `trialEndsAt` + `status`, `Membership` with `accountStatus`, `checkLimit` engine, `withEntitlement` middleware. But there is no trial creation on signup, no trial expiration enforcement, no site suspension tied to subscription state, and no user-facing trial-expired UX.

## Architecture Decision: No Grace Period
**Decision:** No payment grace period. When the trial expires and no paid subscription exists, sites are suspended **immediately**. Rationale: the Free plan itself has meaningful limits (1 site, 4 pages, 2 AI/day); the trial is about access to those Free-plan capabilities, not an extended soft-limit window. A grace period adds complexity (cron jobs, background checks) without product value at the MVP stage. This is documented explicitly — a future epic may add dunning/grace if business requirements change.

## Data Model (existing + additions)

### Subscription (existing — `src/features/monetization/repository.ts`)
Already has: `trialEndsAt?: Date`, `status: "trialing" | "active" | ...`, `planId`, `currentPeriodStart/End`.

### Membership (existing)
Already has: `accountStatus: "active" | "suspended" | "frozen"`, `updatedAt`.

### Additions
- **Trial creation on signup**: When a new user is created, auto-create a `Subscription` with `status: "trialing"`, `planId: "free"`, `trialEndsAt: now + 15 days`.
- **Site `isSuspended` field**: Add a derived boolean to `UsageSnapshot` so `checkLimit` can block suspended users. Actually, `accountStatus: "suspended"` already blocks via `checkLimit` (line 46-53 of checkLimit.ts). No new site field needed — suspension lives at the account level via `Membership`.

## Trial Lifecycle

```
NEW USER
   ↓
Subscription created: status="trialing", trialEndsAt=+15d, plan="free"
   ↓
During trial: user has access to Free-plan capabilities
   ↓
TRIAL EXPIRES (now > trialEndsAt, status still "trialing")
   ↓
Site access blocked via withEntitlement → 403 account_suspended
   ↓
If user pays → status="active" (or "past_due" then "active"), accountStatus remains "active"
   ↓
If user returns without paying → stays suspended until payment
```

## Grace Period Decision
**No grace period.** Trial expiry → immediate suspension. Documented above.

## Site Access Behavior
- **`AccountStatus`**: `"active"` — full Free-plan access. `"suspended"` — all protected actions blocked (403).
- The existing `checkLimit` already returns `account_suspended` (403) when `accountStatus === "suspended"`. The `withEntitlement` middleware already enforces this on all API routes.
- **We need a job** (cron) to transition expired-trial subscriptions: set `accountStatus: "suspended"` when `trialEndsAt < now` and `status === "trialing"`.

## Scope Boundaries

### In Scope
- Trial creation on user signup (server-side)
- Trial expiration detection (cron job + on-auth check)
- Site suspension tied to account status
- Server-side enforcement on all protected routes
- User-facing trial-expired state (banner/message in editor, dashboard)
- Reactivation path (when subscription becomes active, restore access)
- Migration: existing users without trial get a trial created on next login

### Out of Scope
- Real payment gateway integration (Epic 12 / future)
- Email/SMS notifications about trial expiry
- Proration or partial refunds
- Team/business plans

## Tasks

### MM01 — Trial Data Model & Creation
- Modify `resolveSubscriptionForUser` / account creation to issue a 15-day trial
- Add `getTrialStatus(userId)` helper: returns `{ isActive, expiresAt, isExpired }`
- Add trial fields to session context if needed

### MM02 — Trial Enforcement & Suspension
- Cron: check daily for expired trials → set `accountStatus: "suspended"`
- `withEntitlement`: trial-expired + no paid sub → treat as suspended
- Editor/dashboard: show trial-expired state with clear messaging
- Reactivation: when subscription status changes to `active`/`paid`, clear suspension

## Dependencies
- Epic 11 (monetization foundation) — already complete
- `cronjob_manage` tool for trial-expiration cron job
- Session/auth infrastructure (better-auth)

## Acceptance Criteria
- [ ] New user gets `Subscription{status:"trialing", trialEndsAt:+15d}` on signup
- [ ] Protected routes work during trial
- [ ] Expired trial → `accountStatus:"suspended"` → 403 on all protected actions
- [ ] Site data is NOT deleted on suspension
- [ ] Paid/active subscription bypasses suspension
- [ ] Reactivation restores access
- [ ] Existing users without trial get one on next login
- [ ] `npm run lint && npx tsc --noEmit` pass
