# Task 02 — Business-info step restyle

## Context

Epic 02 built the business-info form (grouped fields, autosave, searchable category select, Continue gating). This task restyles its interior to the Monomastic language within the shared wizard shell (Task 01). The grouped sections and their titles become the "field-note" headings; the fields use the M02 restyled form primitives. All behavior (autosave, validation, advance) is untouched.

## Scope

- Restyle the business-info form's grouped sections (`About your business`, `Who you serve`, `How can customers reach you?`, `Anything else?`) using `SectionHead`/paper grouping and the M02 form primitives.
- Keep required-field affordances (name + category) visible and the searchable category Select restyled (behavior intact, M02 Task 04).
- Continue/Back bar follows the shell conventions (Task 01).

## Technical details

Files (restyle the Epic 02 component):

```
src/features/create-wizard/components/BusinessInfoForm.tsx   // restyle only
```

Design mapping:
- Each group header uses the `SectionHead` tab/title pattern (smaller scale than hero) so the form reads as indexed notebook pages (`i`, `ii`, `iii`… optional via M02 `index`).
- Fields = M02 primitives; helper/optional notes as `ink-2` Caveat or `StickyNote` for guidance.
- Required indicators in `red`; Continue gating logic unchanged.

## Dependencies

- `epics/05-ui/04-create-wizard/01-wizard-shell-and-stepper.md` (Task 01 shell).
- `epics/02-site-creation-flow/02-business-info-step/02-business-info-form.md` + `01-business-info-api.md`.

## Out of scope

- Changing field list, validation, autosave, or advance semantics.
- Restyling other step interiors (Tasks 03–05).

## Acceptance criteria

- [ ] Grouped sections render with hand-note headings; fields use the Monomastic form primitives; searchable Select behaves as before (only restyled).
- [ ] Name + category required affordance stays prominent and Continue stays gated identically.
- [ ] Autosave still runs as before (no timing/behaviour change).
- [ ] RTL-correct in `/ar/*`; usable at 375px; paper kept subdued on this dense form.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
