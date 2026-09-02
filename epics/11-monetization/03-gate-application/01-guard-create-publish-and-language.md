# Task — Guard create / publish / languages / template-switch routes

## Title
Apply monetization guards to site create, publish, language, and template-switch routes

## Context
These are the structural actions that define site limits: how many sites, published sites, languages, and pages a plan allows.

## Scope
Wire `withEntitlement` into the four routes per the GATING MATRIX (maxSites, maxPublishedSites, maxLanguages, maxPagesPerSite), returning the standard paywall shape.

## Technical details
- Routes:
  - `src/app/api/sites/route.ts` (POST, create) → `maxSites`.
  - `src/app/api/sites/[siteId]/publish/route.ts` (POST) → `maxPublishedSites`.
  - `src/app/api/sites/[siteId]/languages/route.ts` (POST/PATCH) → `maxLanguages`.
  - `src/app/api/sites/[siteId]/switch-template/route.ts` (POST) → `maxPagesPerSite` when the target template's page count would exceed the plan.
- Keep existing auth (getSession/getSiteForOwner) and 202/409 generation semantics. On `maxPublishedSites`, block BEFORE mutating.
- Free defaults must not break a currently-working Free user (per M03 shared context); verify each guarded action still succeeds on Free for a normal site.

## Dependencies
- M01 tasks, M02 helpers. Epic 06 (publish), Epic 08 (pages), Epic 05 (languages).

## Out of scope
- AI/image guards (task 02). Paywall UI (task 03). Admin (Epic 12).

## Acceptance criteria
- Creating a site beyond `maxSites`, publishing beyond `maxPublishedSites`, adding a language beyond `maxLanguages`, or switching to a template whose pages exceed `maxPagesPerSite` → 402 with standard shape; within limits → unchanged behavior.
- Frozen/suspended → 403.
- Free-plan normal flows still work e2e (create → edit → publish → change language).

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per repo build rule.
- ESLint clean; typecheck passes; guarded-routes smoke-tested on Free + a test Pro.
