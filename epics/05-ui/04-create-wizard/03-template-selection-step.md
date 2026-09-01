# Task 03 — Template selection step restyle

## Context

Epic 02 built the template grid (suggested-first ordering, see-all toggle, select-marks-card, image-fallback). This task restyles its interior to the Vexo language within the shared shell: template cards become paper `Card`s with `TapeTag`-style hints, the suggested group gets a `SectionHead` label, and selection state is a clear `red` checkmark. All ordering/toggle/selection behavior is untouched.

## Scope

- Restyle the template grid, its suggested-group label, see-all toggle, and per-card selection state.
- Cards: `Card` surface (`paper-2`, ink border, hard shadow), preview image, plain name + one-line description (plain language, per product rules — styling only, no wording changes), selected = red check + ink/red border emphasis.
- Use `TapeTag`/`SectionHead` for the "Suggested for you" grouping and the page title from the shell.

## Technical details

Files (restyle the Epic 02 components):

```
src/features/create-wizard/components/TemplatePicker.tsx
src/features/create-wizard/components/TemplateCard.tsx
```

Mapping: `SectionHead` title/tab for the heading; `Card` for each template; selection highlighted with `--red` check and border; image-fallback (text-only) path keeps working, just styled. RTL: grid order flows start→end; checkmark on the correct side.

## Dependencies

- `epics/05-ui/04-create-wizard/01-wizard-shell-and-stepper.md` (Task 01 shell).
- `epics/02-site-creation-flow/03-template-library/03-template-selection-screen.md` (+ its listing API deps).

## Out of scope

- Changing template ordering, the see-all toggle logic, selection state, or the preview-asset loading/fallback behavior.
- Restyling other step interiors (Tasks 02, 04, 05).

## Acceptance criteria

- [ ] Template cards render as paper `Card`s with names/descriptions in plain language; selected card shows red check + emphasis; exactly-one selection still enforced by the existing logic.
- [ ] Suggested group is visually distinct (SectionHead/TapeTag); see-all toggle behavior unchanged.
- [ ] Image-fallback still renders text-only card when an image fails.
- [ ] RTL-correct in `/ar/*` (grid + checkmark); usable at 375px.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
