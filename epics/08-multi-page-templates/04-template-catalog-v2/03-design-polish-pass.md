# Task — Intentional design polish pass

## Title
Strengthen each template's visual design so it no longer reads as generic

## Context
Templates currently feel basic/templated. Within the shared component system (`src/shared/site-render/sections/*`, monomastic design tokens, `template.style: { fontPair, radius, imagery }`, `defaultAccent`), each template should get a deliberate, distinctive visual identity.

## Scope
A design-only pass over the templates and their sections: distinctive composition, spacing, imagery treatment, typography pairing, and accent use — per template — without changing the data model or adding structural editing.

## Technical details
- Files: `src/shared/site-render/sections/*` (shared components tuned per `template.style`), `src/features/templates/catalog.ts` (defaultAccent/style), and CSS/tokens in `src/shared/site-render/tokens.ts`.
- Consult and apply the `frontend-design` skill guidance: distinctive typography, intentional color/space, imagery that sells the business, no boilerplate defaults.
- Keep the existing per-section component contract (fields, image slots, editMode callbacks) intact so the editor keeps working.
- RTL/Arabic and mobile must stay correct (Epic 07 fixes preserved).
- Do NOT add new dependencies; reuse Tailwind + css vars + the existing font/token system.

## Dependencies
- M04 tasks 01 & 02 (pages + real images give the design something real to work with). Epic 07 (fidelity baseline).

## Out of scope
- New structural editing. Changing the editor chrome (Epic 09 handles template picker, not template internals).

## Acceptance criteria
- Each template has a visibly distinct, intentional design (not a near-copy of siblings).
- Editor and live look identical; EN + AR + mobile + desktop correct.
- No regression in editing (click-to-edit, image slot selection, brand color, publish).

## Definition of Done
- `CODE_RULES.md` read and followed; `frontend-design` skill applied; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
