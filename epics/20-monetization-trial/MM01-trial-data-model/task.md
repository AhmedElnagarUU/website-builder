# M01 — Trial Data Model & Creation

## Goal
Create a 15-day free trial for every new eligible user. Trial state lives in the existing `Subscription` model (`trialEndsAt`, `status: "trialing"`). No new collections or tables — extend the existing monetization layer.

## Context
- `src/features/monetization/repository.ts`: `Subscription` has `trialEndsAt?: Date`, `status` includes `"trialing"`. `Membership` has `accountStatus: "active" | "suspended" | "frozen"`.
- `resolveSubscriptionForUser(userId)` creates a `free` subscription with `status: "active"` if none exists — no trial logic.
- `src/features/auth/lib/session.ts`: `getSession()` returns `{ user: { id, email, name } }`.
- `src/shared/auth/server.ts`: `better-auth` with `mongodbAdapter`, `emailAndPassword` enabled.
- `SignUpForm.tsx`: calls `authClient.signUp.email(...)` then redirects to dashboard.

## Data Model (no schema change — fields already exist)
`Subscription`:
- `planId: "free"`
- `status: "trialing"` (initial)
- `trialEndsAt: Date` (now + 15 days)
- `currentPeriodStart`: now
- `currentPeriodEnd`: now + 15 days

## Implementation Steps

### Step 1: Trial duration constant
Create `src/features/monetization/const.ts` addition or a new `lib/trial.ts`:
```ts
export const TRIAL_DURATION_DAYS = 15;
```

### Step 2: Modify `resolveSubscriptionForUser`
When creating a new subscription for a new user, set:
- `status: "trialing"` (not `"active"`)
- `trialEndsAt: new Date(now + 15 days)`
- `currentPeriodStart: new Date(now)`
- `currentPeriodEnd: trialEndsAt`

### Step 3: Add `getTrialStatus(userId)` helper
Returns `{ isActive: boolean, expiresAt: Date | null, isExpired: boolean }`:
- Look up `Subscription` for the user.
- If `status === "active"` and no `trialEndsAt` → user is paid, trial is over (not expired, just converted).
- If `trialEndsAt` exists → `isActive = now < trialEndsAt`, `isExpired = now >= trialEndsAt`.
- If no subscription → no trial (new behavior: create one on next login, see Step 4).

### Step 4: Trial creation on signup (auth event hook)
Add a `better-auth` hook or post-signup callback that calls `resolveSubscriptionForUser` for new users. Since better-auth `emailAndPassword` doesn't have a direct signup hook in v1.7.2, we'll create the trial subscription lazily — `resolveSubscriptionForUser` already creates one on first call, so it will issue a trial for any user who doesn't have one yet (including existing users).

## Acceptance Criteria
- [ ] New user's first `resolveSubscriptionForUser` call creates `Subscription{status:"trialing", trialEndsAt: +15d}`
- [ ] `getTrialStatus` correctly reports active/expired
- [ ] Existing users without subscription get a trial on next `resolveSubscriptionForUser` call
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

## Validation
1. `npx tsc --noEmit` — must pass with 0 errors
2. `npm run lint` — must pass with 0 warnings
3. Code review: `resolveSubscriptionForUser` creates trial with correct fields
4. `getTrialStatus` handles all states (no sub, trialing, active, paid)
