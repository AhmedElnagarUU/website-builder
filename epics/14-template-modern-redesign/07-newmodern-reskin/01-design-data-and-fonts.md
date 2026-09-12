# Task — Design Data Model & Fonts Foundation (newmodern reskin)

## Title
Wire the per-template newmodern design data: fonts, `TemplateDesign` on `TemplateStyle`, per-template palette/signature data in the catalog, root palette spread in `SiteRenderer`, and signature primitives in `globals.css`/`tokens.ts`.

## Context
The committed Epic-14 framework gives templates family-level looks (corporate/bold/warm/retail/creative share styles). The binding source `01-design-audit/newmodern-design-source.md` assigns each template a **unique** design (palette + fonts + signature). This task makes that data flow through the engine additively so later tasks (02–04) can branch on it, and so typography/palette change across templates without touching `F`/`SlotImage`/providers.

## Scope
- **`src/shared/ui/fonts.ts`**: add the new Latin display/body/mono families as `next/font/google` variables. Do NOT remove existing ones. New families (weeks earlier to the mapping; already-loaded Source_Serif_4 / JetBrains_Mono are reused, not re-imported):
  - Barlow (400/500/600), Barlow_Condensed (500/600/700), IBM_Plex_Mono (400/500) — Redline, Ironclad
  - Space_Grotesk (400/500/600/700), Inter (300/400/500/600) — Volatile, Atelier Voss
  - Fraunces (400/500/600 + italics), Karla (400/500/600), Spline_Sans_Mono (400/500) — Ember & Oak
  - Cormorant_Garamond (300/400/500/600/700 + italics 300/400), Lato (300/400/700) — The Meridian
  - Spectral (300/400/500 + italics), Instrument_Sans (400/500/600), Space_Mono (400/700) — Arbor & Clay
  - Plus_Jakarta_Sans (400/500/600/700/800), Source_Sans_3 (300/400/500/600/700) — Clearview
  - Mulish (400/500/600/700), Fragment_Mono (400 + italics) — Harlan & Co
  - Archivo (300/400/500/600/700 + italics 300/400) — Mara
  - Playfair_Display (400/500/600/700 + italics 400/500) — Atelier Voss
  - IBM_Plex_Sans (300/400/500/600) — Ironclad body
  - Give each a `variable` with a stable name (e.g. `--font-barlow`, `--font-barlow-condensed`, `--font-fraunces`…). Add all to `fontVariables`.
  - RTL: keep Arabic faces (`--font-ar-serif`/`--font-ar-sans`) untouched; Latin families carry only `subsets: ["latin"]`.
- **`src/features/templates/types.ts`**: add `TemplateDesign` interface and optional `design?: TemplateDesign` on `TemplateStyle` (KISS shape from `07/MILESTONE.md`).
- **`src/features/templates/catalog.ts`**: give each of the 10 templates its `design` block (palette with exact hex from `newmodern-design-source.md`, `fonts: { heading, body, mono }` using the new CSS vars, `signature` string). Keep existing `style.{fontPair,radius,imagery,theme}` values.
- **`src/shared/site-render/SiteRenderer.tsx`**: root `style` object merges `...template.style.design?.palette` alongside `["--brand"]`; when `design.fonts` exists, add `"--font-serif2"`, `"--font-body"`, `"--font-mono"` overrides from it (so `.site-heading-*`/`.site-body`/mono utilities reflect the design). Additive; nothing else changes in the file.
- **`src/app/globals.css`**: add additive signature primitives keyed off the palette vars (they must be **no-ops without their vars set**, so non-reskinned or preview contexts stay safe). Provide at minimum: hard offset shadow helpers (`site-sig-hard-shadow`), dotted leaders (`site-sig-dots`, `site-dot-rule`), marquee (`.site-marquee-track` + `@keyframes site-marquee`, reduced-motion off), contact-sheet/regs helpers (`.site-sig-regs` before/after red corners), specimen label card, ledger rules (single/double gold), charred-text gradient class, text-stroke classes, gold hairline, float animation, and any generic pattern classes later tasks need. Keep namespaced `site-*`.
- **`src/shared/site-render/tokens.ts`**: add tiny helpers if useful (e.g. `signatureClass(style)`, `hasDesign(style)`), KISS. Do not break existing exports (`siteBodyClass`, `siteHeadingClass`, `siteSurfaceClass`, `RADIUS_CLASSES`, `CARD_RADIUS`, `CARD_SHADOW`, `textOnBrand`).

## Technical details
- Read `01-design-audit/newmodern-design-source.md` fully; copy exact hex values and font names from it. Also read `07/MILESTONE.md` "Data model (binding)".
- The palette vars set on the root are **global for that subtree** — put template-specific semantic colors there (e.g. Redline `--paper`, `--ink`, `--line`, `--signal`, `--signal-soft`, `--steel`, `--night`). Do NOT overload existing Tailwind tokens (leave `bg-background`/`bg-card`/`text-foreground` semantics alone; `site-surface-deep` already handles deep surfaces; newmodern deep palettes may additionally override via `palette` for precision).
- Keep Arabic safe: never force a Latin-only family on `lang="ar"`; existing `:lang(ar)` overrides in globals.css already route headings/body to Arabic stacks — your overrides of `--font-body` etc. must sit inside `:not(:lang(ar))` or be overridden by the AR rules (verify the Arabic still validates in `/preview/…` both locales).
- No comments beyond what explains a non-obvious var intent; KISS.

## Dependencies
- `01-design-audit/newmodern-design-source.md` (binding). `07/MILESTONE.md`. CODE_RULES.md.
- Build rule from `02/MILESTONE.md` (dev on :3000 must be stopped; delete `.next`; build plainly; restart dev; check `/api/health`).

## Out of scope
- Any section-component redesign (tasks 02–04). `atoms.tsx` behavior changes. Demo content (05). `preview.svg` (06). New npm deps. Removal/deprecation of committed Epic-14 machinery.

## Acceptance criteria
1. `npm run lint` + `npx tsc --noEmit` pass; `npm run build` passes (build rule).
2. All 10 catalog templates carry a `design` block; `grep '"signature"' src/features/templates/catalog.ts` count = 10; hex values match `newmodern-design-source.md` for a spot-check per template.
3. `/preview/classic-services` root div style contains Redline palette vars (`--paper:#f1ebe1`, `--signal:#e4572e`, …); `/preview/modern-studio` root carries its vars; deep templates unaffected negatively.
4. Rendered headings on a reskinned template use the design's heading face (inspect computed `font-family` in built HTML — e.g. Redline → Barlow Condensed) and `/preview/classic-services` in AR still renders Arabic faces (Amiri/Noto) — no Latin-only forced on `lang="ar"`.
5. New globals.css classes are namespaced `site-*`; no collisions; deep/light surfaces still correct (guard: a quick render of `visual-showcase` and `classic-services` after restart).

## Definition of Done
- CODE_RULES §1–§8 followed; tsc/lint/build green under build rule; `/api/health` ok after dev restart; the five acceptance criteria verified; Arabic-locale preview spot-check done for at least two templates.