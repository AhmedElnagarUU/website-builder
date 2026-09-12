# Milestone 07 — Newmodern Full Per-Template Reskin (design-source override)

## Goal
Apply the user-confirmed 10 `newmodern/` mockups as each template's **binding design language** — true per-template palettes, typography, and signature patterns — on top of the (committed) Epic-14 framework. This supersedes the generic family-level looks currently implemented (all "corporate" templates share one style) and replaces the family directions in `01-design-audit/audit-report.md` §3/§5.

## Binding design source
**`01-design-audit/newmodern-design-source.md`** — the full spec (per-template palettes with exact hex, next/font families, signature CSS with exact properties, header/hero/section/footer treatments, motion). Read it fully. It is authoritative; where it conflicts with `audit-report.md` visual directions, newmodern wins.

## Binding 10→10 mapping (user-confirmed)

| template | design source | signature |
|---|---|---|
| classic-services | websites-template/services (Redline) | ticket cards + hard offset shadows + dotted leaders + marquee |
| modern-studio | websites/agency (Volatile) | text-stroke + neon accent + marquee + pill buttons |
| warm-kitchen | websites-template/restaurant (Ember & Oak) | charred gradient text + fire-readout + seal + dotted menu leaders |
| bistro-menu | websites/hotel (The Meridian) | gold hairlines + Cormorant light + parallax quote |
| simple-shop | websites-template/retail (Arbor & Clay) | specimen herbarium labels + care tags + dot leaders |
| product-focus | websites/medical (Clearview) | 12px radius cards + float badge + teal glow lift |
| professional-profile | websites-template/professional (Harlan & Co) | ledger card + double rule + Fragment Mono stamps |
| consultant-page | websites/construction (Ironclad) | stat-border + amber on black + service cards |
| clean-portfolio | websites-template/portfolio (Mara) | contact sheets + registration marks (.regs) + plate labels |
| visual-showcase | websites/architecture (Atelier Voss) | asymmetric grids + Playfair + gold counters |

## Data model (binding, designed for KISS + engine seam)
- Add **optional** `design?: TemplateDesign` to `TemplateStyle` (`src/features/templates/types.ts`):
  ```ts
  export interface TemplateDesign {
    palette: Record<string, string>;            // CSS var name (with `--`) → value, e.g. { "--paper": "#f1ebe1", "--ink": "#17191b", "--line": "#d8d1c3", "--signal": "#e4572e" }
    fonts?: { heading?: string; body?: string; mono?: string }; // font-family stacks or `var(--font-x)` refs
    signature: string;                          // one of the ten signatures above
  }
  ```
- `SiteRenderer` root (`SiteRenderer.tsx:149-152`) spreads `design.palette` into the existing `style={{ "--brand": brandColor, ... }}` and, when `design.fonts` present, overlays `--font-serif2` / `--font-body` / `--font-mono` on the root (CSS custom-property inheritance makes every existing `.site-heading-*`/`.site-body`/`.mono-*` utility reflect the design). Additive only; no seam changes.
- `SiteStyleContext` value is already `TemplateStyle` (`context.ts:64`) — the optional `design` field flows automatically. Default stays safe for unit use.
- `siteBodyClass`/`siteHeadingClass` in `tokens.ts` keep returning the design-agnostic classes; per-design font switching happens via overridden CSS vars on the root.

## Everything else
- No new npm deps (CODE_RULES §4). Google fonts via `next/font/google` are allowed (not npm packages).
- No hardcoded user-facing strings (CODE_RULES §6): any new copy uses `demoContent.ts` data (task 05) → rendered via `F`, not hardcoded.
- RTL/logical utilities everywhere (CODE_RULES §6); Arabic falls back to `--font-ar-serif`/`--font-ar-sans` per existing `:lang(ar)` rules — Latin display faces (Barlow Condensed, Fraunces, Playfair…) have no Arabic glyphs and must degrade to the existing Arabic stack.
- No structural/drag-and-drop editing; publishing vs editing stay separate; manually edited content never overwritten (product invariants — EPIC.md).
- The engine seam is honored: `SiteRenderer` provider nesting, `F`, `SlotImage`, `SampleTag`, `SectionRenderProps`, section→component mapping untouched. Section components are redesigned **inside their own files**; `atoms.tsx`/`tokens.ts`/`globals.css` extended additively; `catalog.ts` data + `demoContent.ts` edited freely.
- Every task must run the verification suite (CODE_RULES §8): `npm run lint`, `npx tsc --noEmit`, and `npm run build` under the build rule in `02/MILESTONE.md` (stop dev on :3000, delete `.next`, build plainly, then restart dev and verify `/api/health`).

## Tasks (execution order, one agent per task)
1. **01-design-data-and-fonts.md** — fonts.ts additions + `TemplateDesign` model + catalog design data + SiteRenderer root palette spread + globals.css signature primitives (var seeds, marquee keyframes, `.site-sig-*` helpers, counters, float, stroke, regs, ledger rules, dot leaders, specimen, contact-sheet, gold-line) + tokens helpers.
2. **02-chrome-reskin.md** — Header (10 designs), Footer (10 designs), Hero (all 10 with correct variant per mapping, eyebrow→H1→sub→CTA hierarchy, per-design CTAs/shadows).
3. **03-homepage-sections.md** — Services, About, Testimonials, CtaBand, Contact per signature across all 10 templates.
4. **04-aux-pages.md** — Menu, Gallery, Faq, Hours, Pricing, Team per signature (e.g. dotted-leader menu rows, bento, accordion, ledger list rows).
5. **05-demo-content.md** — per-template bilingual (EN+AR) demo businesses/copy matching each newmodern brand persona in `demoContent.ts` (additive; keep field keys/counts + `origin: "placeholder"`).
6. **06-thumbnails-and-polish.md** — 10 refreshed `preview.svg` thumbnails matching the newmodern looks; responsive/narrow-width/RTL pass (≤390px, AR split-hero reversal); final before→after quality review notes.