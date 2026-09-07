# Milestone 02 — Shared UI Component Set (Monomastic primitives)

## Goal

Turn the reusable visual patterns in `design/landingPage/variant-14/index.html` into a small set of shared components in `shared/ui` that later milestones (auth, wizard, editor) and future screens consume. Every pattern is extracted from the source, is RTL-safe, and exposes no hardcoded strings.

## Tasks (execution order)

1. `01-button-and-pill.md` — `.btn` / `.btn-primary` pill buttons + secondary/pill variants.
2. `02-card-and-paper-panel.md` — index/feature card, paper panel, sticky-note annotation; the hard-offset shadow + border language.
3. `03-tape-tag-and-section-head.md` — tape tag badge + `.section-head` (yellow tab + title) + step marker.
4. `04-stepper-and-form-primitives.md` — wizard/progress stepper + restyled form primitives (input, textarea, select, label, searchable select) in the notebook language.

## Shared context — PATTERN CONTRACT (from variant-14/index.html)

Each component below reflects a `.class` in the source. Implement them as `shared/ui` components using the M01 tokens. All RTL via logical properties only (CODE_RULES §6).

### Button (source `.btn`, `.btn-primary`)
- Pill `border-radius:999px`, `2px solid var(--ink)`, Caveat ~18px/600, `padding 10px 20px`, inline-flex, gap 8px.
- Base hover: invert (ink fill → paper text). Primary: red fill/paper text, hover → ink.
- Must remain a semantic `<button>`/`<a>`; focus-visible ring per M01 base.

### Card / paper panel (source `.feature`, `.step`, `.lang-card`)
- `background: var(--paper-2)`, `border: 1.5px solid var(--ink)`, `radius 4px`, `box-shadow 4px 4px 0 rgba(42,38,34,0.08)`.
- Optional corner index square (`--ink`/`--red`, Caveat) and optional tiny rotation for hand-made feel.
- Sticky-note annotation (`.annotation`): rotated paper note with a red `✱` and an offset hard shadow.

### Tape tag + section head (source `.tag`, `.section-head`, `.tab`)
- Tape tag: `--tape` translucent fill, `backdrop-filter: blur(2px)`, slight rotation, offset above a card edge.
- Section head: `4fr 8fr` grid, `2px solid --ink` bottom border; rotated yellow `.tab` (dot + Caveat label) + large `h2.title`.

### Stepper / progress & form primitives
- No stepper or form controls exist in the source (it's a marketing page). Derive a *consistent* hand-note style: dashed rule separators, Caveat secondary labels where appropriate, paper-toned fields with `2px ink` borders and the same radius/shadow family. Keep inputs obviously editable and usable (EPIC.md flag #2).
- Form primitives map to the approved styling only — they replace existing `shared/ui` class usage, not their APIs/props or behavior.

## Definition of Done (shared)

- Components live in `shared/ui`, consume M01 tokens (`theme()`/CSS vars), no hardcoded colors/strings.
- Each primitive is RTL-correct in `/ar/*` and usable at 375px.
- Existing consumers keep working — component props/signatures are unchanged from what Epic 01's scaffolding established; this milestone restyles, it does not change APIs.
- `npm run lint && npm run typecheck && npm run build` pass.
