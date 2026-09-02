# Task — Entitlement route helper

## Title
Provide a single `withEntitlement` helper returning the standardized paywall shape

## Context
To keep gating uniform and avoid N copies of the same logic, one helper should wrap any monetized API handler: authorize, resolve the user's subscription/usage, run `checkLimit`, and return the standard paywall error or pass through.

## Scope
Implement `withEntitlement` (or equivalent) in `src/features/monetization/lib/`, plus the shared error serialization used by every gated route.

## Technical details
- Files: `src/features/monetization/lib/entitlement.ts`.
- Signature along the lines of:
  ```ts
  withEntitlement({ userId, siteId?, limitKey, requestedScope }, handler)
    -> 401 (no session) | 403 (account frozen/suspended) | 402 { error, plan, limitKey, message } | handler()
  ```
- Resolves subscription + usage + runs `checkLimit`, then calls the wrapped handler on success.
- Serializes the standardized paywall JSON; message localized is optional at this layer (clients can map `limitKey`), but keep `error`/`limitKey` stable.
- Provide a tiny route-helper `entitlementErrorResponse(result)` any route can import.

## Dependencies
- M02 task 01 (checkLimit + usage). M01 tasks.

## Out of scope
- Applying to specific routes (M03 does that). Admin/CMS (Epic 12). Real gateway.

## Acceptance criteria
- A route using `withEntitlement` returns 401/403/402 with the documented shape when blocked, and invokes the handler when allowed.
- No duplicated paywall logic across routes.
- `npx tsc --noEmit` passes.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- ESLint clean; typecheck passes.
