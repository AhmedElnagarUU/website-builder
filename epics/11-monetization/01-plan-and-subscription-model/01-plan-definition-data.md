# Task — Plan definition data (free / pro)

## Title
Define the plan catalog with all monetizable limits as data

## Context
Monetization starts with a single source of truth describing what each plan allows. We define these as data (not scattered if/else) so the guard layer, the future payments epic, the admin UI (Epic 12), and any paywall all read the same source.

## Scope
Create the plan catalog with a Free and a Pro plan and typed plans structures. Choose sensible initial values; they are editable later.

## Technical details
- New feature: `src/features/monetization/` with `types.ts`, `plans.ts` (catalog), `const.ts` (plan ids).
- Shape per MILESTONE.md ("THE PLAN MODEL"): `PlanDefinition` with `limits` including `maxSites`, `maxPagesPerSite`, `maxLanguages`, `maxPublishedSites`, `maxImageBytes`, `dailyAiGenerations`, `customDomain`.
- Suggested initial values:
  - Free: 1 site, 4 pages/site, 1 language, 0 custom domain, 2 AI generations/day, shared image-size cap.
  - Pro: 10 sites, all pages, 2 languages, custom domain true, generous AI/upload caps.
  Keep the exact numbers in one file so they are trivially adjustable.
- iOS/Android-irrelevant; bilingual `name` (EN/AR).
- No new dependencies.

## Dependencies
- None. Pure feature; no DB yet (that's task 02).

## Out of scope
- Subscription persistence (task 02), guard engine (M02), gating app surfaces (M03), ledger (M04). Real payment gateway.

## Acceptance criteria
- `PlanDefinition` + Free/Pro catalog compile; each limit is a concrete value; plans are looked up by `id`.
- Both EN + AR names present; no hardcoded UI strings.
- `npx tsc --noEmit` passes.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- ESLint clean; typecheck passes.
