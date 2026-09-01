# Task 02 — Shared card / paper panel / sticky-note components

## Context

Variant 14's content surfaces are paper-toned cards (`.feature`, `.step`, `.lang-card`) with the hard offset shadow and ink border, plus rotated sticky-note annotations (`.annotation`). Auth/wizard/editor screens need reusable surfaces that share this paper language. This task extracts them into `shared/ui` primitives.

## Scope

- `Card`/`PaperPanel`: `paper-2` background, `1.5px ink` border, `4px` radius, hard offset shadow; optional corner index square and optional rotation for hand-made variety.
- `StickyNote`/`Annotation`: rotated paper note (`.annotation`) with the red `✱` marker and offset hard shadow — usable for tips/notes/inline prompts.
- Restyle any existing `shared/ui` card usage in place (same props, new look).

## Technical details

Files (adapt to existing `shared/ui` layout):

```
src/shared/ui/Card.tsx             // PaperPanel/Card + index + rotation variants
src/shared/ui/StickyNote.tsx       // annotation/sticky-note
```

Design mapping (bind to source):
- Card: `bg-paper-2`, `border-[1.5px] border-ink`, `rounded`, `shadow-vexa` (the `4px 4px 0 rgba(42,38,34,0.08)` token), `relative`.
- Corner index: absolute square (Caveat glyph) in `--ink`, alternating `--red` for even positions — keep as an optional prop (`index?: string`, `tone?: 'ink'|'red'`).
- Rotation: optional `rotate` prop (small degrees) so callers can add the subtle hand-made tilt without hardcoding.
- StickyNote: paper bg, `1.5px ink` border, hard shadow, start-side red `✱`, optional start-side placement; rotate by default.

Keep the design tokens as the only source of colors/shadows; no magic values in components.

## Dependencies

- `epics/05-ui/01-design-tokens-foundation/*` (M01).
- Existing `shared/ui` card primitives from Epic 01 (to restyle in place).

## Out of scope

- Tape tag and section head (Task 03), stepper and forms (Task 04).
- Building card *content* — this is the surface primitive only.

## Acceptance criteria

- [ ] `Card` renders the paper surface with ink border, radius, and hard offset shadow; `index` and `rotate` variants work.
- [ ] `StickyNote` renders the rotated note with start-side red `✱` and hard shadow.
- [ ] Any existing card-usage screen across the app picks up the new styling with unchanged behavior/props.
- [ ] RTL: `✱`/index sits on the correct (start) side; rotations don't break layout in Arabic.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; components in `shared/ui`, token-driven; no hardcoded strings/colors; no new deps; RTL-safe.
