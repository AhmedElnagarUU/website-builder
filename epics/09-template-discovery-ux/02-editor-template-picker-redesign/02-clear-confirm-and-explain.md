# Task — Clear confirmation & explanation when applying a template

## Title
Make applying a template explicit, well-explained, and status-aware

## Context
Changing a template regenerates content; users found the process confusing. The flow must: clearly explain what will happen (copy regenerated, your manually edited fields preserved per the merge policy), ask for explicit confirmation, and show generation progress — while keeping the "confirmation required" 409 semantics intact.

## Scope
Improve the confirmation modal(s) and the generation-status messaging in `ChangeTemplateControl` so the user is never surprised: what applies, what's kept, current progress, and cancellation.

## Technical details
- Files: `src/features/editor/components/ChangeTemplateControl.tsx` (+ i18n keys in `en.json`/`ar.json`).
- Preserve the backend contract: initial request may return `202` (accepted) or `409 {error:"confirmation_required"}`; the confirm request sends `{ templateId, confirm: true }`.
- Copy must be honest: e.g. "Applying this template regenerates your website copy from your business answers. Content you edited yourself will be kept." — match the actual generation merge policy (see Epic 08 M05 task 02).
- Show per-locale progress (`localesDone/localesTotal`) and failure state; remain cancellable (best-effort) with clear danger styling for destructive auto-accept.
- Bilingual EN/AR, RTL-safe.

## Dependencies
- M02 task 01. Epic 08 M05 task 02 (the merge policy this copy describes).

## Out of scope
- Changing the switch API. The gallery/dashboard (Epic 09 M01).

## Acceptance criteria
- Before applying, the user sees exactly what will and won't be kept, and must explicitly confirm.
- The 409 path surfaces the confirmation dialog; confirmation fires `confirm:true`; 202 shows progress (`x/y`) until complete/failed.
- No silent template application without confirmation.
- EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.