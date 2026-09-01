# Milestone 01 — Design Tokens & Style Foundation

## Goal

Extract every concrete styling decision from `design/landingPage/variant-14/index.html` into the project's single source of design truth: the Tailwind theme (`tailwind.config.ts`), the global base stylesheet, and the locale-aware font handling. After this milestone, every later task in this epic and every future screen can restyle by referencing tokens instead of re-deriving constants from the HTML.

## Tasks (execution order)

1. `01-extract-design-tokens.md` — palette, type scale, spacing, radius, shadows, and the paper/margin background as Tailwind theme tokens.
2. `02-global-base-and-locale-typography.md` — global base layer (paper background, focus, selection, reduced motion) + EN/AR font loading and font-family wiring.

## Shared context — THE TOKEN CONTRACT (from variant-14/index.html)

These are the canonical values. Task 01 turns them into Tailwind theme tokens; Task 02 wires the fonts and base.

### Color tokens (CSS variables in the source)

| Token | Hex / value | Usage in source |
|---|---|---|
| `--paper` | `#F5EFDF` | page background, light surfaces |
| `--paper-2` | `#EBE3D0` | card/lifted surfaces (feature, lang, footer, how bg) |
| `--line` | `#B4C8E8` | ruled-line blue (background lines) |
| `--ink` | `#2A2622` | primary text, borders, hover-fill |
| `--ink-2` | `#5C544A` | secondary text |
| `--ink-3` | `#8E8576` | tertiary/muted text |
| `--red` | `#B23A48` | primary accent (primary button, underlines, index alt) |
| `--blue` | `#2D5BA8` | secondary accent (wavy underline, margin line alt, AR dot) |
| `--yellow` | `#E8B53C` | highlight, tape, tab, sticky notes |
| `--green` | `#4A6B3D` | tertiary accent |
| `--rule` | `rgba(42, 38, 34, 0.20)` | dotted/dashed rule lines |
| `--tape` | `rgba(232, 181, 60, 0.55)` | translucent tape tag fill |

### Typography (four families, exact uses)

| Family | Fallback | Roles in source |
|---|---|---|
| `Caveat` (400–700) | cursive | display/headings, brand, buttons, tabs, hand-drawn notes. **No Arabic glyphs — not for AR.** |
| `Inter Tight` (400–700) | system-ui, sans-serif | body/UI text |
| `Source Serif 4` (400,600, italic) | Georgia, serif | deck/intro paragraph, feature/step body copy |
| `JetBrains Mono` (400,500) | monospace | small uppercase meta labels, footers, eyebrow text |

Headline sizes are CSS `clamp()`: `h1` `clamp(48px, 7.6vw, 112px)`, `h2` `clamp(40px, 5.6vw, 76px)`, final-cta `h2` `clamp(48px, 7.6vw, 124px)`. Brand/labels use Caveat at ~20–34px. Base body 16px, line-height 1.55.

### Layout / rhythm / surface

- `.container` max-width `1180px`; horizontal padding `120px` (900px→`60px`, 700px→`24px` left with a red margin line at `28px`).
- Red vertical margin line: fixed 1px line, `left: 80px` (mobile `28px`), `--red` at ~0.5–0.55 opacity.
- Ruled paper background: `repeating-linear-gradient(0deg, transparent 0, transparent 31px, var(--line) 31px, var(--line) 32px)` + a subtle red radial dot pattern; `background-size: 100% 32px, 100px 100px`.
- Cards: border `1.5px solid var(--ink)`, radius `4px`, `box-shadow: 4px 4px 0 rgba(42,38,34,0.08)` (hard offset shadow), some with a tiny rotation (-1deg–2deg) and an `--ink` or `--red` corner index square.
- Buttons (`.btn`): pill `border-radius:999px`, `2px solid var(--ink)`, Caveat 18px/600; hover invert (ink fill, paper text). `.btn-primary`: red fill/paper text, hover → ink.
- `.section-head`: grid `4fr 8fr`, bottom `2px solid --ink` border, a rotated yellow `.tab` (dot + Caveat label).
- Tape tag: yellow translucent `--tape`, `backdrop-filter: blur(2px)`, slight rotation, offset above a card.

### Interaction / a11y

- `::selection` background `var(--yellow)`, color `var(--ink)`.
- `:focus-visible`: `2px solid var(--red)`, `outline-offset: 3px`.
- `prefers-reduced-motion: reduce` collapses all animation/transition to `0.01ms`.
- `Arial`-none; antialiased.

## Definition of Done (shared)

- All tokens exist in Tailwind theme (colors, fonts, radius, shadows, spacing as needed) and are used via `theme()`, not magic strings pasted into components.
- Fonts load without adding dependencies; the project must build offline-friendly (Google Fonts via existing mechanism, font families wired for both `en` and `ar`).
- Arabic rendering uses the Arabic serif stack (Amiri / Noto Naskh Arabic) with correct `dir`, never Caveat.
- No hardcoded strings; `npm run lint && npm run typecheck && npm run build` pass.
