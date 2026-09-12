# Task — Thumbnails, Responsive Polish & Final Review (newmodern)

## Title
Refresh the 10 `preview.svg` thumbnails to the newmodern looks, run the responsive/RTL/overflow pass, and produce the final before→after quality review for the reskin.

## Context
Tasks 01–05 delivered fonts/data, chrome, homepage sections, aux pages, and demo copy. This is the final polish + visual QA milestone: the template-picker thumbnails must look like the newmodern designs (they are the first thing users see), narrow/AR layouts must not break, and the epic closes with a recorded review.

## Scope
- **`public/templates/<id>/preview.svg` ×10** — redraw each hand-authored SVG thumbnail to represent its newmodern design (palette, typography cues, signature patterns) at thumbnail legibility:
  - classic-services → cream paper + ink + signal orange, condensed title, ticket/ledger rows
  - modern-studio → near-black + neon lime, stroke text
  - warm-kitchen → dark soot + embers gradient, Fraunces serif
  - bistro-menu → navy + gold line, Cormorant light
  - simple-shop → ivory + fern + clay, specimen label
  - product-focus → white + teal 12px cards
  - professional-profile → paper + navy + brass ledger
  - consultant-page → iron-black + amber statistics
  - clean-portfolio → bone + red regs/contact-sheet
  - visual-showcase → linen + gold-bronze asymmetric
  Match the palette hexes and at least the display-face family of the design (SVG `<text>` can use the font-family names; Latin-only is fine for thumbnails but keep them clean at 60–120px). Must remain XML-valid and small.
- **Responsive / RTL / overflow pass** — audit every reskinned section for: ≤390px width (narrow card + hero stacking, menu leaders, pricing), AR `rtl` split-hero reversal + arrow flips, no horizontal overflow (marquee excluded by design), container-query grids not broken, `prefers-reduced-motion` honored for any new animation (marquee/float/stroke).
- **`src/app/globals.css`** — any small additive fixes surfaced by the pass (namespaced `site-*`, RTL-safe).

## Technical details
- Read `newmodern-design-source.md` for per-template palette/signature thumbnails. Read `07/MILESTONE.md`. Read one existing `preview.svg` for format conventions and `EPIC.md` "Engine limitation" notes (thumbnail falls back when no `screenshot.png`).
- Keep `screenshot: /templates/<id>/screenshot.png` and fallback behavior unchanged (out of scope to generate real PNGs).
- No new images; no new deps; no messages changes; no engine changes.
- Produce a short `07-newmodern-reskin/quality-review.md` recording: per-template verdict (matches newmodern look? strong points; residual gaps), invariants reconciliation (RTL/AR, no drag-and-drop, publishing separate, edited content never overwritten, no deps), the "needs a human browser pass" list, and any deferred items.

## Dependencies
- Tasks `07/01`–`07/05` complete + verified. `newmodern-design-source.md`. CODE_RULES.md.

## Out of scope
- Generating real `screenshot.png`. Adding/removing templates. Changing catalog structure. New dependencies.

## Acceptance criteria
1. lint + tsc + build green; `/api/health` ok.
2. All 10 `preview.svg` files exist, XML-valid, updated to newmodern look; spot-check 3 visually via rendered file naming/palette.
3. Narrow-width (≤390px) and AR run of `/preview/<id>` (+/menu, /gallery for a couple) show no broken overflow/RTL bugs in code (logical props, `rtl:rotate-180` present where arrows exist, marquee excluded).
4. `quality-review.md` written with the required sections.
5. Reduced-motion: new animated elements respect `prefers-reduced-motion`.

## Definition of Done
- CODE_RULES; suite green; thumbnails updated + XML-valid; responsive/RTL pass done and recorded; `quality-review.md` submitted with per-template verdicts + human-browser list; no open blockers.