# Task 01 — Sign-in page restyle

## Context

Epic 01 built the sign-in page with default styling. This task restyles it to the Vexo language so the first screen a user meets (or returns to) feels like the product its landing page describes.

## Scope

- Restyle `/{locale}/auth/sign-in` (or the page path Epic 01 established) — the page's component, not its logic.
- Reuse M02 primitives: `Card`/paper panel, `SectionHead` (tab + title), `Button` (primary CTA), form primitives.
- Brand mark in Caveat + red `✱` (matches `.brand`), on the notebook background with subdued paper on the panel.

## Technical details

Files (restyle the component that Epic 01 created):

```
src/features/auth/.../SignInForm (or page component)   // restyle only
```

Mapping:
- Outer: notebook background (M01 base) with the start-side margin line; the card sits centered.
- Panel: `Card` (`paper-2`, ink border, hard shadow), `SectionHead` for the heading, brand in Caveat with the red `✱`.
- Fields: M02 form primitives. Error state in `red`. Primary submit uses `Button primary`.
- Footer links / language switcher already present — restyle to token links.

No string changes: reuse existing `auth.*` keys verbatim.

## Dependencies

- `epics/01-foundation/03-authentication/02-sign-in-sign-up-pages.md` (existing pages).
- `epics/05-ui/02-shared-component-set/*` (M02 primitives).

## Out of scope

- Changing auth/validation/API behavior.
- Restyling sign-up (Task 02) or other screens.

## Acceptance criteria

- [ ] Sign-in renders as a centered paper panel over the notebook background; brand shows Caveat + red `✱`.
- [ ] Fields, error message (red), and primary CTA use the Vexo styling from M02; all existing `auth.*` strings appear unchanged.
- [ ] Functionally identical: submitting still calls the same flow; errors still show the same messages.
- [ ] Usable at 375px; RTL-correct in `/ar/*` (form/panel mirror correctly, Arabic uses AR stack).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven styling; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
