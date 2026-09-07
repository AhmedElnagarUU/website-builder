# Task 01 — Wizard shell & stepper (shared across the four steps)

## Context

The four create-wizard steps share a common chrome: a header with the ongoing step progress, a paper backdrop with the red margin line, and consistent Back/Continue. Today each step renders its own minimal layout. This task introduces (and lightly applies) a shared shell around the four steps so they read as one continuous "field notebook" journey.

## Scope

- A shared wizard shell/layout (paper backdrop, margin line, brand, `Stepper` showing the 4 steps, Back/Continue surface conventions).
- Apply the shell to the four step pages (business-info, templates, language, generating) by wrapping/embedding their existing content — without changing their routing, state, or step logic.

## Technical details

Files (add a shared shell; individual steps embed it):

```
src/features/create-wizard/components/WizardShell.tsx    // shared chrome + Stepper
src/app/[locale]/create/business-info/page.tsx           // wrap in shell
src/app/[locale]/create/templates/page.tsx               // wrap in shell
src/app/[locale]/create/language/page.tsx                // wrap in shell
src/app/[locale]/create/generating/page.tsx              // wrap in shell
```

Design mapping:
- Shell background = notebook (M01 base) with start-side red margin line + subdued `.mono-surface` treatment on the content column.
- Header: brand (Caveat + red `✱`) + `Stepper` (M02) with the four steps; current step highlighted.
- `Stepper` reflects `currentStep` from the site (business-info/templates/language/generating) — read from the same data the steps already use; do not invent new state.

## Dependencies

- `epics/05-ui/02-shared-component-set/*` (M02 primitives, esp. `Stepper`).
- The four step pages from `epics/02-site-creation-flow/*` and `epics/03-ai-content-generation/02-generation-progress-screen/01-progress-screen-polling.md`.

## Out of scope

- Restyling the interior of each step (Tasks 02–05).
- Changing step ordering, routing, or `currentStep` logic.
- Adding any new data source.

## Acceptance criteria

- [ ] All four step pages render inside the shared shell with brand + `Stepper`; current step matches the site's `currentStep`.
- [ ] Back/Continue affordances still route exactly as before.
- [ ] Shell is RTL-correct and usable at 375px; paper pattern subdued on the content column.
- [ ] No string changes; existing `wizard.*` strings render as-is.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; shared shell in `create-wizard`; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
