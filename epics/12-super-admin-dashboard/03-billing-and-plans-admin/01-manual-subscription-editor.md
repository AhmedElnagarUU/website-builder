# Task — Manual subscription editor

## Title
Admin UI to view and change a user's plan/subscription

## Context
For trials, appeals, or cash sign-ups, the operator must be able to manually set a user's plan and subscription fields without them going through a gateway (none exists yet).

## Scope
Admin UI on the user detail to edit the subscription: plan (Free/Pro), status (active/trialing/past_due/canceled/ended), billing period start/end, and cancel-at-period-end — persisted via the Epic 11 `PATCH /api/admin/users/[userId]/subscription` API, with an audit entry.

## Technical details
- Files: `src/features/admin/components/SubscriptionEditor.tsx` wired into `UserDetail`; consumes the Epic 11 admin subscription API; validation via zod (plan ids, enum statuses, dates, cancel-at-period-end boolean).
- Current subscription shown (plan, status, period, accountStatus); edits save and reflect in `getSubscriptionForUser` immediately.
- Submit appends an audit entry (action `set_subscription`/`set_plan`).
- Confirm dialog for non-obvious changes; bilingual + RTL; mono-styled.
- Money fields (if any shown) are minor units/currency.

## Dependencies
- Epic 11 M04 task 02 (admin subscription API). Epic 12 M02 (user detail + audit).

## Out of scope
- Recording payments (task 02). Gateway.

## Acceptance criteria
- Admin can set plan/status/period and it persists; read-back matches.
- Non-admin → 403; invalid input → 422.
- Audit entry recorded for each change; EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; subscription edit + audit smoke-tested.
