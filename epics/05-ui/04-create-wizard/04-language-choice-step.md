# Task 04 — Language choice step restyle

## Context

Epic 02 built the language-choice screen (EN / AR / Both, with the location-based default suggestion and explicit confirmation). This task restyles its interior to the Monomastic language within the shared shell. The two language options become paper `Card`s (mirroring the source's `.lang-card` with its EN/AR pairing — the Arabic card shows the AR serif treatment exactly like the source), the default suggestion is a `StickyNote`/`TapeTag`, and selection state is a clear `red` mark. Behavior untouched.

## Scope

- Restyle the EN/AR/Both option cards using `Card`; the Arabic card gets the AR serif heading (never Caveat) matching `variant-14/index.html`'s `.lang-card.ar`.
- Default-suggestion guidance rendered as a `StickyNote` (or `TapeTag` hint).
- Selection + confirmation flow unchanged.

## Technical details

Files (restyle the Epic 02 component):

```
src/features/create-wizard/components/LanguageChoice.tsx   // restyle only
```

Mapping: option cards ~ `.lang-card` (paper-2, ink border, hard shadow); EN card uses Caveat/Serif heading; AR card uses AR serif stack + RTL; selected card gets `red` emphasis/check; suggestion note as `StickyNote`. No wording/string changes.

## Dependencies

- `epics/05-ui/04-create-wizard/01-wizard-shell-and-stepper.md` (Task 01 shell).
- `epics/02-site-creation-flow/04-language-choice/02-language-choice-screen.md`.

## Out of scope

- Changing the language options, default-suggestion logic, or confirmation flow.
- Restyling other step interiors (Tasks 02, 03, 05).

## Acceptance criteria

- [ ] EN/AR/Both render as paper cards; the AR card shows the Arabic serif heading and correct RTL (matching the source's `.lang-card.ar`).
- [ ] Default suggestion shows as a `StickyNote`/hint; selection state is clear.
- [ ] Confirmation and routing behavior unchanged.
- [ ] RTL-correct in `/ar/*`; usable at 375px.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
