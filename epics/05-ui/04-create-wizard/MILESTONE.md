# Milestone 04 — Create Wizard (Monomastic style)

## Goal

Restyle the four create-wizard steps (business info → templates → language → generating) and their shared shell/stepper with the Monomastic design language, so the core "AI builds my site" journey feels like a hand-written field notebook — while keeping these functional forms calm and scannable (EPIC.md flag #2: restraint on dense form surfaces). Visual only; step logic, autosave, APIs, and routing are untouched.

## Tasks (execution order)

1. `01-wizard-shell-and-stepper.md` — shared shell (paper surface, back/continue, step progress) applied across the four steps.
2. `02-business-info-step.md` — restyle the grouped autosaving form.
3. `03-template-selection-step.md` — restyle the template grid + suggested/see-all behaviour (styling only).
4. `04-language-choice-step.md` — restyle the language choice screen.
5. `05-generation-progress-step.md` — restyle the "Writing your website…" waiting screen.

## Shared context

- All four steps already exist (Epic 02 + Epic 03). This milestone swaps styling only.
- The shell provides: a shared header (wizard brand + step progress via M02 `Stepper`), the paper backdrop with the red margin line, and Back/Continue consistent with each step's existing routing.
- Strings already exist via next-intl (`wizard.*` namespaces) — do not add or reword them; tasks only restyle.
- Themed on Variant 14's field-note language: `SectionHead` titles with Caveat (AR stack in Arabic), `TapeTag` for step hints, `Card`s for template/language options, `StickyNote` for subtle guidance.

## Definition of Done (shared)

Per task files; all four steps + shared shell are styled, token-driven, RTL-safe; step behavior/routing/APIs unchanged; no hardcoded strings; no new deps; `npm run lint && npm run typecheck && npm run build` pass.
