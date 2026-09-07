# Task 02 — Global base layer + locale typography (EN/AR fonts)

## Context

Task 01 added the token values to the Tailwind theme. A design system also needs the global base layer (page background, focus/selection, reduced-motion) and the actual font loading + `font-family` wiring for both English and Arabic. The source defines the paper background, the red margin line, `::selection`, `:focus-visible`, and `prefers-reduced-motion` handling; and it substitutes an Arabic serif stack (Amiri / Noto Naskh Arabic) for Arabic text because the Caveat handwriting face has no Arabic glyphs. This task makes those real in the app.

## Scope

- Load the four Latin families from the source (`Caveat`, `Inter Tight`, `Source Serif 4`, `JetBrains Mono`) plus the Arabic serif stack (`Amiri` + `Noto Naskh Arabic`) via the project's existing font mechanism — **no new npm dependency** (see CODE_RULES §4).
- Apply global base styles: the `paper` background with the ruled-line + radial-dot pattern and the fixed red margin line, on the `<body>`/app shell — but **subdued on focused form/editor surfaces** (see EPIC.md flag #2).
- Wire `font-family` per locale: Latin families by default; Arabic locale swaps display/headings to the Arabic serif stack (never Caveat) while keeping a readable Arabic body stack.
- `::selection`, `:focus-visible`, and `prefers-reduced-motion` per the source.

## Technical details

Recommended files:

```
src/app/globals.css (or app-level stylesheet)   // base layer: body bg, margin line, selection, focus, reduced-motion
src/shared/i18n/... (font wiring helper)        // export font stacks; apply per-locale via <html> class or CSS
src/app/[locale]/layout.tsx                      // apply the locale-aware font class to <html>
```

Rules:

- Put the paper pattern and margin line behind a CSS variable / modifier class so M04/M05 can reduce or remove it on dense form/editor surfaces (the design flags call for restraint there). Expose e.g. a `.mono-surface` utility / a `--mono-bg` control rather than hardcoding into a single element.
- Arabic: when locale is `ar`, heading-family resolves to the Arabic serif stack; body uses an Arabic-friendly sans/serif readable stack. Directions are inherited from `<html dir>` (already set by Epic 01) — this task does not change `dir`.
- RTL: keep all styling LTR-agnostic (logical offsets) so the margin line / backgrounds mirror correctly under RTL via the existing `ms-*`/`ps-*` conventions (CODE_RULES §6). The red margin line should sit on the start side (logical), matching how the source places it on the left.
- Do not add any npm package. If font loading requires a mechanism the project doesn't yet have, flag it rather than installing (see EPIC.md flags) — prefer the existing `next/font/google`/link path already used, extended with the five families.

### Strings introduced (exact keys/values)

None. This task introduces no user-facing strings.

## Dependencies

- `epics/01-foundation/02-i18n-foundation/01-next-intl-en-ar-rtl.md` (the `<html dir>`/locale handling this task builds on).
- `epics/01-foundation/01-project-scaffold/01-initialize-nextjs-project.md` (the Tailwind/global-css setup and app shell to attach base styles to).

## Out of scope

- Restyling specific screens or shared components (M02–M05).
- Changing locale negotiation or `dir` logic (Epic 01 owns it).
- Adding a font npm dependency.

## Acceptance criteria

- [ ] All five families are available in both `en` and `ar` app shells; headings on `/ar/*` render in the Arabic serif stack (never Caveat); Latin pages use Caveat+Inter Tight+Source Serif 4+JetBrains Mono per token intent.
- [ ] `body` shows the paper background + ruled lines + start-side red margin line on normal pages.
- [ ] On a representative focused surface (e.g. a form page) the paper pattern is visibly subdued via the `.mono-surface` modifier, without breaking the token system.
- [ ] `::selection` is yellow/ink; `:focus-visible` is a `2px solid --red` ring with 3px offset; reduced-motion collapses transitions to ~0.
- [ ] Everything renders correctly under RTL (background/margin mirror logically, no directional utilities leaking).
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; fonts load with no new dependency; base layer is token-driven (uses `theme()`/CSS vars, no scattered hardcoded colors); no hardcoded strings; RTL-safe.
