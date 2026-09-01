# Milestone 03 — Auth Pages (Vexo style)

## Goal

Restyle the sign-in and sign-up screens (built in Epic 01) with the Vexo design language so the auth experience matches the landing page's promise from the first interaction. Visual only — auth behavior, validation, and API wiring are untouched.

## Tasks (execution order)

1. `01-sign-in-page.md` — restyle the sign-in screen.
2. `02-sign-up-page.md` — restyle the sign-up screen.

## Shared context

- The two auth pages share the same surface: a centered paper panel on the notebook background, brand mark in Caveat with the red `✱`, a section-head with tab label, the form primitives from M02, error messaging in `red`, and the primary CTA button.
- All strings already exist via next-intl (namespace `auth.*`) — this milestone only changes styling; do not add or reword strings.
- Keep it usable at 375px; RTL-correct in `/ar/*`; keep the paper pattern subdued on the form (EPIC.md flag #2).

## Definition of Done (shared)

Per task files; both pages are styled, token-driven, RTL-safe, no hardcoded strings, no behavior/API changes, no new deps; `npm run lint && npm run typecheck && npm run build` pass.
