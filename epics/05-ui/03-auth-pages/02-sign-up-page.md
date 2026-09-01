# Task 02 — Sign-up page restyle

## Context

Epic 01 built the sign-up page with default styling. This task restyles it to match the sign-in page and the overall Vexo language, so both auth screens read as one product.

## Scope

- Restyle `/{locale}/auth/sign-up` (or the page path Epic 01 established) using the same surface/pattern as the restyled sign-in: centered `Card` panel over the notebook background, brand mark, `SectionHead`, form primitives, primary CTA.
- Match the sign-in page's visual decisions exactly (same panel tokens, same subdued paper treatment).

## Technical details

Files (restyle the component that Epic 01 created):

```
src/features/auth/.../SignUpForm (or page component)   // restyle only
```

Mapping: identical surface system to Task 01 (Card panel, SectionHead, brand + red `✱`, M02 form primitives, primary CTA button, red error text). Reuse existing `auth.*` strings verbatim — do not reword.

## Dependencies

- `epics/01-foundation/03-authentication/02-sign-in-sign-up-pages.md` (existing page).
- `epics/05-ui/03-auth-pages/01-sign-in-page.md` (visual parity target).
- `epics/05-ui/02-shared-component-set/*` (M02 primitives).

## Out of scope

- Changing auth/validation/API behavior.
- Restyling non-auth screens.

## Acceptance criteria

- [ ] Sign-up renders as a centered paper panel styled identically to sign-in; brand shows Caveat + red `✱`.
- [ ] Fields, red error handling, and primary CTA match the Vexo language; existing `auth.*` strings unchanged.
- [ ] Functionally identical to before (same submit flow, same messages).
- [ ] Usable at 375px; RTL-correct in `/ar/*`; Arabic uses AR stack.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
