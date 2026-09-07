# Milestone 02 — Design System Foundation

## Goal
Establish the visual foundation the redesign builds on: an additive per-template `TemplateTheme` in the style data model, context + token plumbing, site typography/surface utilities (RTL-correct), and the reusable section primitives (section head, CTA band, card family, header/footer) that every later milestone composes with.

## Tasks (execution order)
1. **01-style-data-model.md** — `TemplateTheme` + `TemplateStyle.theme` (required), catalog assignments, `SiteStyleContext` widening, `tokens.ts` mapping, additive `globals.css` utilities (`.site-heading-*`, `.site-body`, `.site-surface-deep`).
2. **02-reusable-compositions.md** — Reusable primitives: section-head variants, accent-role-aware CTA band, card family (`site-card`), stat/testimonial patterns; header + footer consistency; localized contact labels.

## Shared context (binding for this milestone)
- This milestone owns the **one sanctioned architectural change** of the epic: `TemplateStyle` gains a required `theme: TemplateTheme` field, and `SiteStyleContext` exposes the full style object. Everything else in the engine seam (SiteRenderer provider nesting, `F`, `SlotImage`, `SampleTag`, `SectionRenderProps`, content contract, section→component mapping) is preserved as-is. READ `epics/14-template-modern-redesign/EPIC.md` "Product invariants" for the allowed/forbidden list.
- **Theme model (final):**
  ```ts
  export interface TemplateTheme {
    key: "corporate" | "bold" | "warm" | "retail" | "creative";
    surface: "light" | "deep";
    headingFont: "serif" | "sans";
    hero: "photo-bleed" | "split-light" | "split-deep";
    accentRole: "fill" | "edge";
  }
  ```
  `TemplateStyle` gains `theme: TemplateTheme` (required). Assignments per the M01 task table; `catalog.ts` `def()` already receives `style` per template — add `theme` to each style object (no signature change needed if passed inside the style object; else extend `def` minimally).
- **SiteStyleContext** value becomes the full `TemplateStyle` (`{ fontPair, radius, imagery, theme }`). Defaults in `context.ts` must stay safe for direct unit use; `SiteRenderer` already passes `template.style` — only the context type/default expand.
- **Typography utilities (additive in `globals.css`, RTL-correct):**
  - `.site-heading-serif` → `font-family: var(--font-serif2)`; `.site-heading-sans` → `var(--font-body)`; `.site-body` → `var(--font-body)`.
  - Arabic overrides: `:lang(ar) .site-heading-serif, :lang(ar) .site-heading-sans { font-family: var(--font-ar-serif) }` and `:lang(ar) .site-body { font-family: var(--font-ar-sans) }`. Sections never set a font-family utility directly; they use `.site-body` and the heading classes so RTL swaps stay correct. `fontPair` mapping in `tokens.ts` picks the body + heading class combo per theme (`serif` → `.site-heading-serif`, `sans` → `.site-heading-sans`).
  - Sizes/weights/letter-spacing live in section markup (design freedom), not in these utilities.
- **Surface utility (additive):** `.site-surface-deep` applied on the `SiteRenderer` root for `surface === "deep"` templates overrides the subtree CSS vars to a dark palette (define `--background`, `--card`, `--muted`, `--muted-foreground`, `--foreground`, `--input`, `--border`, `--ring: var(--brand)`) using exact hex values chosen in the audit. Light templates need no override. All existing semantic utilities (`bg-background`, `bg-card`, `bg-muted/40`, `text-foreground`, `text-muted-foreground`, `border-input`) then adapt automatically — verify with a quick render.
- There is an existing seam: sections currently render headings `text-3xl font-bold` + accent bar `h-1 w-12 rounded-full`. The primitives in task 02 replace this uniformly.
- The renderer root (`SiteRenderer` line ~149) currently sets `bg-background text-foreground` + font class + radius class + `--brand`; M02 extends it to also apply `.site-body` + `.site-surface-deep` where appropriate, via `tokens.ts` helpers. No other changes to that file.
- **Contact labels:** `ContactSection` hardcodes "Tel/Email/Address". Add keys `site.labels.tel`, `site.labels.email`, `site.labels.address` to `src/messages/en.json` + `ar.json` and use them (`useTranslations("site")`). Translations:
  - en: `Tel` / `Email` / `Address`
  - ar: `هاتف` / `البريد` / `العنوان`
- Build rule (mandatory for verification): never `npm run build` while a dev server runs. Stop dev (kill :3000 listener with `$procId`/plain variable — never `$PID`), delete `.next`, run `npm run build` plainly (do NOT pipe through `Select-Object`), then `start-dev.bat` and verify `http://localhost:3000/api/health` → `{"status":"ok"}`. `Retrying`/swc spam is harmless.