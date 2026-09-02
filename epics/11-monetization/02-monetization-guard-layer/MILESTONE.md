# Milestone 02 — Monetization Guard Layer

## Goal
Provide a single, deterministic **limit-checking engine** and a consistent **paywall error contract** that every monetized route/API reuses, so gating is uniform and later swaps cleanly to a real gateway.

## Shared context
- All gating goes through `src/features/monetization/lib/`. Helpers are **pure functions of (user subscription, current usage, requested scope)** — no hidden state, no scattered checks.
- **Paywall error shape** (used by every blocking route):
  ```ts
  { error: "limit_reached" | "requires_upgrade" | "account_frozen" | "account_suspended", plan: "free"|"pro", limitKey: "maxSites"|"...", message: {en?, ar?} }
  ```
  Returned with an HTTP 402 (Payment Required) for limits/upgrade, 403 for account-suspended/frozen. (Keep status codes consistent so clients can branch.)
- Freeze vs suspend semantics (used across the product): **frozen** = account paused/billing on hold, read-only or limited; **suspended** = fully blocked (no create/publish/generate). Both are admin-controlled (Epic 12).

## Tasks
1. **01-limit-check-engine** — `checkLimit` + `getUsageForUser(userId)` and per-limit evaluation.
2. **02-entitlement-route-helper** — a single `withEntitlement` wrapper returning the standardized paywall shape, pluggable on any route.
