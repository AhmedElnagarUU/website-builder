# Task 04 — Wizard stepper + form primitives (notebook-language controls)

## Context

Variant 14 is a marketing page and contains no form controls or stepper — so this task must *derive* a consistent hand-note treatment for the product's interactive form controls and the multi-step progress indicator, staying within the token family already established. The business-info intake, template grid, and language screens depend on form primitives; the four create-wizard steps need a shared stepper. This task restyles existing `shared/ui` form primitives (their APIs/behavior are unchanged) and adds a stepper primitive.

## Scope

- Restyle `shared/ui` form primitives (Input, Textarea, Select, Label, and the searchable category Select from Epic 02) in the paper/ink language: recognizable as fields, comfortable to fill, notebook-tinted (EPIC.md flag #2 — restraint on functional surfaces).
- A shared `Stepper`/progress primitive for the create-wizard steps (business-info → templates → language → generating) and (reused later) the editor saved-indicator.
- Keep the searchable-select behavior contract from Epic 02 intact; only its visual styling changes.

## Technical details

Files (adapt to existing `shared/ui` layout):

```
src/shared/ui/Input.tsx / Textarea / Select / Label        // restyle in place
src/shared/ui/Stepper.tsx                                   // step progress indicator
```

Design mapping:
- Fields: paper-toned fill, `2px ink` border, `4px` radius, comfortable padding, Caveat turn-away label or `ink-2` helper where the source tone suggests it; focus = ink border + red outline ring (M01 base). Disabled/error states readable (use `red` for errors per palette).
- Stepper: numbered steps as Caveat markers/`·` separators (or index squares matching `.feature .index`), current step highlighted with `--red`, completed steps with `--ink`/check; dashed rule connecting steps (mirrors `.step .detail` rule). RTL-safe ordering.

All step labels / field labels are localized strings passed from callers (next-intl) — never hardcoded here.

## Dependencies

- `epics/05-ui/02-shared-component-set/*` (M01 tokens + sibling primitives, optional).
- `epics/02-site-creation-flow/02-business-info-step/02-business-info-form.md` and `03-template-library/03-template-selection-screen.md` + `04-language-choice/02-language-choice-screen.md` (the screens that consume these controls and the stepper).

## Out of scope

- Restyling the wizard *screens* themselves (that's M04) — this task only provides the primitives.
- Changing form control behavior, validation, or the searchable-select data flow.
- Any new npm dependency (e.g. no form library).

## Acceptance criteria

- [ ] Input/Textarea/Select/Label render in the paper/ink notebook style; focus/error states use the token ring and red error color; all still pass the exact props/signatures Epic 01–02 established.
- [ ] The searchable Select still filters and behaves as before, only restyled.
- [ ] `Stepper` renders the four create steps with current/complete states; ordering is RTL-correct.
- [ ] Coverage at 375px (no horizontal scroll); both locales verified by eye.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; form primitives restyled in `shared/ui` without API/behavior changes; new `Stepper` in `shared/ui`; token-driven; no hardcoded strings; no new deps; RTL-safe.
