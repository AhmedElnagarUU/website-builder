# Task — Remove the obsolete modal preview

## Title
Delete `TemplatePreview.tsx` and its now-unused message keys

## Context
The modal preview is the exact UX this epic replaces (small preview inside the current page). Keeping it would create a duplicate/conflicting mechanism for the same action. After M02 task 01, nothing references the trigger, so the modal and trigger can be removed from the tree.

## Scope
- Delete `src/features/templates/components/TemplatePreview.tsx` (the modal + `TemplatePreview` trigger component).
- Remove message keys that existed only for the modal: `preview.sample_hint`, `preview.close`, `preview.page_label` from `src/messages/en.json` and `src/messages/ar.json`. Keep `preview.view` (used by the new-tab link). Add `preview.back` and `preview.demo_badge` (used by the preview shell) in the same edit if not already present from M01.
- Verify via full-repo grep that: no file imports `TemplatePreview`, and no remaining i18n key references resolve to the removed keys.

## Technical details
- Keep `src/features/templates/lib/demoContent.ts` — M01 reuses it (it is shared preview infrastructure, not modal code).
- Keep any `TemplatePreviewLink`/`TemplatePreviewShell` files; they are the new implementation.
- If `eslint`/`tsc` surfaces any stale import, fix the importing file (should be none after task 01).

## Dependencies
- M02 task 01 (all three cards switched to the new-tab link).

## Out of scope
- Refactoring the SVG thumbnail system (M03). Changes to the shell/demo content.

## Acceptance criteria
- `src/features/templates/components/TemplatePreview.tsx` no longer exists.
- `grep -r "TemplatePreview"` shows only `TemplatePreviewLink` and `TemplatePreviewShell` references (no modal).
- `preview.sample_hint`, `preview.close`, `preview.page_label` absent from both message files; no dead-key references in code.

## Definition of Done
- `CODE_RULES.md` followed; `npx tsc --noEmit` passes; ESLint clean; build verified per the build rule.