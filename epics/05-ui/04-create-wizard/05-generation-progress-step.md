# Task 05 — Generation progress step restyle

## Context

Epic 03 built the Step-4 "Writing your website…" screen (rotating status messages, polling, retry on failure, stuck-run detection). This task restyles its interior to the Monomastic language within the shared shell: a calm, reassuring notebook-style waiting surface — the brand + a paper "writing" motif, rotating friendly messages as hand-note callouts, a low-key progress indicator, and a clear primary Retry button on failure. All polling/status/retry logic is untouched.

## Scope

- Restyle the progress/waiting surface, the rotating message callouts, the progress indicator, and the failure/retry state.
- Keep it minimal and calm (the source's final-CTA's reassurance tone → a `StickyNote`-style status + a spare indicator).

## Technical details

Files (restyle the Epic 03 component):

```
src/features/create-wizard/components/GenerationProgress.tsx   // restyle only
```

Mapping:
- Waiting: brand (Caveat + red `✱`) + one message at a time as a paper `StickyNote`/callout; a subtle animated indicator (dashed rule / dots) consistent with the notebook rhythm and reduced-motion. Account for the existing ~4s message rotation and ~2s polling (unchanged).
- Failure: `failed_title` message + primary `Button` (reuses `wizard.generating.retry`); same retry/stuck logic.
- No string changes; `wizard.generating.*` keys reused as-is.

## Dependencies

- `epics/05-ui/04-create-wizard/01-wizard-shell-and-stepper.md` (Task 01 shell).
- `epics/03-ai-content-generation/02-generation-progress-screen/01-progress-screen-polling.md`.

## Out of scope

- Changing polling cadence, message rotation, status handling, or retry logic.
- Restyling other step interiors (Tasks 02–04).

## Acceptance criteria

- [ ] Progress surface reads as a calm notebook waiting state; brand + one rotating message at a time; indicator is low-key and respects reduced motion.
- [ ] On failure, `failed_title` + Retry (primary button) match the Monomastic styling; retry/stuck logic unchanged.
- [ ] RTL-correct in `/ar/*`; usable at 375px.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; token-driven; no hardcoded strings; no behavior/API changes; no new deps; RTL-safe.
