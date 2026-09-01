# Task 01 — Editor top bar / chrome restyle

## Context

Epic 04's editor is wrapped in an `EditorShell` top bar (language tabs, desktop/mobile preview toggle, saved indicator, brand-color control, and an action area), sitting above the live-rendered preview. This task restyles that chrome to the Vexo language, keeping it calm and functional (EPIC.md flag #2). All behavior is untouched.

## Scope

- Restyle the editor top bar: brand/site name, per-language tabs (EN/AR), desktop/mobile toggle, saved-indicator, brand-color swatch row (`BrandColorControl` from Epic 04 M03), and the action area (SectionHead/Primary buttons).
- Use M02 primitives (`Button`, `TapeTag`-style tab indicators, `Stepper`-style saved state) and M01 tokens.
- Interaction states (active tab, selected color, toggle-on) must remain obvious.

## Technical details

Files (restyle the Epic 04 components):

```
src/features/editor/components/EditorShell.tsx
src/features/editor/components/BrandColorControl.tsx   // restyle existing control
```

Mapping:
- Top bar: subdued `paper-2` strip with ink bottom rule (mirrors footer/nav of the source); brand in Caveat + red `✱`.
- Language tabs: styled like `TapeTag`/pill tabs, active one emphasized with `--red`.
- Desktop/mobile toggle, saved indicator ("Saved"/unsaved), and color swatches all restyled to token language; saved indicator color (e.g. `green` when saved, muted otherwise) reads clearly.
- No string/API/behavior changes.

## Dependencies

- `epics/05-ui/02-shared-component-set/*` (M02 primitives).
- `epics/04-preview-and-edit/01-site-render/02-editor-preview-page.md`, `02-text-editing/02-tap-to-edit-ui.md`, `03-brand-color-customization.md`.

## Out of scope

- Restyling in-preview affordances (Task 02).
- Changing editor behavior, language tabs, toggle, saved state, or brand-color logic.
- Adding any structural editing control.

## Acceptance criteria

- [ ] Top bar reads as a Vexo chrome strip (brand + red ✱ + ink rule); language tabs, toggle, saved indicator, and color swatches all styled and clearly legible.
- [ ] Active/selected states are unmistakable in both locales.
- [ ] All editor behavior (tab switching, toggle, autosave-saved state, color PATCH) unchanged.
- [ ] RTL-correct in `/ar/*`; usable at 375px (top bar wraps without horizontal scroll).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
