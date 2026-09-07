# Task 01 — Extract Variant 14 design tokens into the Tailwind theme

## Context

`design/landingPage/variant-14/index.html` is the source-of-truth style reference for Epic 05. Before any screen can be restyled, its concrete styling decisions must exist as named tokens in the project's Tailwind theme so later tasks and future screens reference `theme()` values instead of re-deriving constants from the HTML. This task performs that extraction (colors, type, radius, shadows, paper/margin background). Font loading and the global base layer are Task 02.

## Scope

- Add the palette, type families/sizes, radius, shadow, and paper/margin background as Tailwind configuration in `tailwind.config.ts`.
- Keep everything additive and non-breaking: existing screens must continue to work; this task introduces tokens but does not yet restyle screens (that is M02's primitives and M03–M05's screens).

## Technical details

Files:

```
tailwind.config.ts                 // extend theme with Monomastic tokens
```

Token mapping (bind every value to the source's CSS variables — see MILESTONE.md "Shared context"):

- Colors: `paper`, `paper-2`, `line`, `ink`, `ink-2`, `ink-3`, `red` (→ `--red`), `blue`, `yellow`, `green`, plus derived `rule` (`rgba(42,38,34,0.20)`) and `tape` (`rgba(232,181,60,0.55)`). In Tailwind these become e.g. `colors: { paper: {...} ... }` so both `bg-paper`, `text-ink`, `border-ink` and alpha variants like `text-ink/60` work.
- Font families: `display` (Caveat stack), `body` (Inter Tight stack), `serif2` (Source Serif 4 stack), `mono` (JetBrains Mono stack) added as `fontFamily` tokens. These names are used by `font-*` utilities. Arabic-specific stacks are handled in Task 02 (not here) because Tailwind fonts don't do per-locale switching inside the theme.

Keep the tokens flat and boring (CODE_RULES §1): prefer named single-purpose tokens over nested property-objects, and do NOT invent tokens the source doesn't use. Do not add a token just because a generic design system would have one.

## Dependencies

- `design/landingPage/variant-14/index.html` (source of truth).

## Out of scope

- Loading the font files / font-family `html` wiring (Task 02).
- The global base layer (paper background, focus, selection) (Task 02).
- Restyling any screen or shared component (Milestones 02–05).
- Adding any new npm dependency (fonts load via the existing mechanism — Task 02).

## Acceptance criteria

- [ ] `tailwind.config.ts` exposes every token listed in the MILESTONE "Shared context"; each maps to the source value exactly (spot-check `--paper`→`#F5EFDF`, `--red`→`#B23A48`, radius 4px, hard-shadow `4px 4px 0 rgba(42,38,34,0.08)`).
- [ ] Utilities resolve: `bg-paper`, `text-ink`, `border-ink`, `bg-red-?` (the `red` brand token, distinct from Tailwind's built-in `red-*`), `shadow-monomastic` (the hard offset shadow) etc. actually compile and apply.
- [ ] No component file in `src/` was modified by this task.
- [ ] Existing screens build and render unchanged.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; tokens defined in one place (`tailwind.config.ts`) and named to the source's intent; no new dependencies; no hardcoded magic colors introduced into components by this task.
