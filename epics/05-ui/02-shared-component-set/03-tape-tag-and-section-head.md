# Task 03 — Tape tag + section-head (yellow tab + title) components

## Context

Two signature grouping patterns from Variant 14: the **tape tag** (`.tag` — a translucent yellow sticker clipped to a card corner) and the **section head** (`.section-head` — a rotated yellow `.tab` with a dot + Caveat label, plus a big Caveat `.title`, sitting on a `2px` ink bottom rule). These give the product its "filed under / field-note" rhythm across the wizard and editor.

## Scope

- `SectionHead`: the `4fr 8fr` header row (title + optional tab label) with the ink bottom rule; the yellow rotated tab with its dot; title in Caveat (AR stack in Arabic).
- `TapeTag`: the translucent yellow sticker badge with blur and slight rotation, positioned relative to a card/surface.

## Technical details

Files (adapt to existing `shared/ui` layout):

```
src/shared/ui/SectionHead.tsx      // tab label + title
src/shared/ui/TapeTag.tsx          // tape/sticker badge
```

Design mapping (bind to source):
- SectionHead: grid `4fr 8fr` (collapse to 1fr under ~900–700px), `border-b-2 border-ink`, `pb`, gap; optional `tab` (yellow, `--yellow`, rotate -1deg, dot + Caveat label) + `title` (Caveat, `clamp` size, em/accent underline support).
- TapeTag: `background: var(--tape)`, `backdrop-filter: blur(2px)`, small rotation, offset above/overlapping an edge, Caveat text.

These are content-flexible primitives: they render labels/titles passed as children (strings come from callers via next-intl, never hardcoded here).

## Dependencies

- `epics/05-ui/01-design-tokens-foundation/*` (M01).
- M02 Tasks 01–02 optional (they may compose these, but not required to).

## Out of scope

- The wizard stepper and form primitives (Task 04).
- Hardcoding any specific screen's labels/titles.

## Acceptance criteria

- [ ] `SectionHead` lays out as `4fr 8fr` at desktop, stacks at mobile; shows the yellow tab (dot + label) and Caveat title with ink bottom rule.
- [ ] `TapeTag` renders the translucent yellow, blurred, slightly-rotated sticker; overlaps a card edge correctly.
- [ ] Both accept children/localized text (no hardcoded strings); Arabic title uses the AR stack.
- [ ] RTL: grid order and dot/rule flip correctly; no directional utilities.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; components in `shared/ui`; token-driven; no hardcoded strings/colors; no new deps; RTL-safe.
