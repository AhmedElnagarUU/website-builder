# Task — Limit-check engine and usage computation

## Title
Build the deterministic `checkLimit` engine and per-user usage computation

## Context
Gating needs two pieces: "what is the user allowed" (from their plan) and "how much have they used" (from real data), evaluated together for a given requested scope.

## Scope
Implement `getUsageForUser(userId)` (counts: sites, pages/site, languages, published sites, AI generations today, biggest image) and `checkLimit(userSubscription, usage, limitKey, requestedScope)` returning a typed result (allowed + remaining, or the paywall reason).

## Technical details
- Files: `src/features/monetization/lib/usage.ts` and `src/features/monetization/lib/checkLimit.ts` (types in `types.ts`).
- Usage counts come from existing repositories:
  - sites by owner: `src/features/sites/repository.ts` (`listSitesByOwner`).
  - pages/site: from the site's template/pages (Epic 08) or `Site.content`.
  - AI generations today: from the generation records (Epic 02/03) — may need a small query addition; keep it minimal (a lightweight counter is acceptable).
  - published sites: count sites with `status === "published"`.
- `checkLimit` returns `{ ok: true; remaining } | { ok: false; reason, limitKey }` using the plan catalog values.
- Respect `accountStatus`: `frozen`/`suspended` produce a dedicated result the route layer turns into 402/403.
- Pure & deterministic; no network calls inside evaluation beyond the pre-computed usage.

## Dependencies
- M01 tasks 01 & 02. Epic 08 (pages). Epic 02/03 (generation).

## Out of scope
- Route wiring (task 02). Gating application (M03). Ledger (M04).

## Acceptance criteria
- `getUsageForUser` returns accurate counts from real data for a seeded user.
- `checkLimit` blocks when usage >= plan limit and allows when under; remaining is correct.
- Frozen/suspended statuses map to distinct reasons.
- No new dependency; unit-testable pure functions.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- ESLint clean; typecheck passes; basic usage/limit scenario verified.
