# Task — Guard AI generation and image upload routes

## Title
Apply daily-AI-generation and image-size monetization guards

## Context
AI content generation (the most costly capability) and image upload are both plan-limited. These guards protect the Core on expensive calls and enforce size limits tied to the plan.

## Scope
Wire `withEntitlement` into the generate/regenerate routes (`dailyAiGenerations`) and the image-upload route (`maxImageBytes`/file size), returning the standard paywall shape.

## Technical details
- Routes:
  - `src/app/api/sites/[siteId]/generate/route.ts` (POST) → `dailyAiGenerations`.
  - `src/app/api/sites/[siteId]/regenerate/route.ts` and `regenerate-section/route.ts` → `dailyAiGenerations` (regenerating also consumes).
  - `src/app/api/sites/[siteId]/image-upload/route.ts` (POST) → `maxImageBytes`; the client (`src/features/editor/lib/uploadImage.ts`) already validates a fixed max — make it plan-aware by reading the entitlement (or have the route reject with the paywall shape).
- Daily counter: increment a per((userId,date)) counter when generation actually runs; decrement not needed. Use `getUsageForUser`'s generation-today count. Ensure the generation-status flow (Epic 02/03) still reports correctly.
- Keep the existing S3/image path unchanged (S3 backend defect still deferred); only add the size/entitlement gate.

## Dependencies
- M01 tasks, M02 helpers. Epic 02/03 (generation), Epic 08 (image slots).

## Out of scope
- Create/publish/languages guards (task 01). Paywall UI (task 03). S3 backend fix.

## Acceptance criteria
- Exceeding `dailyAiGenerations` → 402 standard shape before a new generation starts; within limit → generation proceeds and the daily counter increments.
- Uploading an image larger than `maxImageBytes` → 402 with standard shape (or client-side plan-aware rejection); sized-ok uploads proceed exactly as before.
- Frozen/suspended → 403.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; generation + upload gated flows smoke-tested.
