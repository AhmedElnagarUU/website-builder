# Hermes.md — Agent handoff / continue-work brief

**Repo:** `C:\Users\ahmed\OneDrive\Desktop\website-version2` ("monomastic" — AI website builder).
**Written:** 2026-09-12, end of an orchestration session that was paused mid-execution.

---

## 1. Mission (the original job)

The user wants the product's **10 website templates** redesigned so they look like the 10 modern, polished mockup websites in the **`newmodern/` folder**, instead of the current generic "family-level" look. The user is a non-technical business owner facing `/preview/<template-id>`; that preview is the strongest sales moment, so the templates must look like real professional sites.

**Confirmed decisions (user chose these — they are binding, do not re-ask):**
1. Design source = **the `newmodern/` mockups** (NOT the generic family directions in the Epic-14 audit report).
2. Confirmed 10→10 mapping:

| template | newmodern source | brand | signature |
|---|---|---|---|
| classic-services | `websites-template/services` | Redline Service Co. | ticket cards + hard offset shadows + dotted leaders + marquee |
| modern-studio | `websites/agency` | Volatile Studios | text-stroke + neon accent + marquee + pill buttons |
| warm-kitchen | `websites-template/restaurant` | Ember & Oak | charred gradient text + fire-readout + seal + dotted menu leaders |
| bistro-menu | `websites/hotel` | The Meridian | gold hairlines + Cormorant light + parallax quote |
| simple-shop | `websites-template/retail` | Arbor & Clay | specimen herbarium labels + care tags + dot leaders |
| product-focus | `websites/medical` | Clearview Dental | 12px radius cards + float badge + teal glow lift |
| professional-profile | `websites-template/professional` | Harlan & Co. | ledger card + double rule + Fragment Mono stamps |
| consultant-page | `websites/construction` | Ironclad Builders | stat-border + amber on black + service cards |
| clean-portfolio | `websites-template/portfolio` | Mara Ellsworth | contact sheets + registration marks (.regs) + plate labels |
| visual-showcase | `websites/architecture` | Atelier Voss | asymmetric grids + Playfair + gold counters |

3. Reskin depth = **FULL per-template reskin** (each template wears its own distinct design language — palettes, fonts, signature patterns). The cheaper "palette+typography only" option was explicitly rejected.

## 2. Where we stopped

- We got through **planning + documentation only**. **No implementation code has been written yet.**
- The last action: Phase-1 implementation subagent (task `07-01`) was **launched and then cancelled by the user** — it did no work. Its cancellation is why this handoff exists.

## 3. Important prior-state fact (verified in code)

Epic 14's **framework is ALREADY fully implemented and committed** (in commit `b24bbcd "templet strucher"` / `78ea0fd`):
- `TemplateTheme` exists in `src/features/templates/types.ts` (key/surface/headingFont/hero/accentRole), required on `TemplateStyle`, all 10 templates assigned in `catalog.ts`.
- `SiteStyleContext` widened; `tokens.ts` has `siteBodyClass/siteHeadingClass/siteSurfaceClass` + `RADIUS_CLASSES/CARD_RADIUS/CARD_SHADOW/textOnBrand`.
- `globals.css` has `.site-heading-serif/-sans/.site-body/.site-surface-deep` with `:lang(ar)` Arabic overrides; deep palette hexes `#0f1115/#171a20/#1e2229/#9aa1ac/#f2f3f5/#2a2f38`.
- `atoms.tsx` has `SectionHead`, `SiteCard` (5 sub-styles), `StatBlock`, `CtaBand` — accent-role-aware.
- All 14 section components redesigned with **family-level** branches (corporate/bold/warm/retail/creative). `ContactSection` uses localized `site.labels.*`. `demoContent.ts` has 10 distinct bilingual demo businesses. 10 `preview.svg` thumbnails refreshed.
- Build/verification rule (in `epics/14-template-modern-redesign/02-design-system-foundation/MILESTONE.md`): never `npm run build` while dev runs; stop :3000 (plain var, never `$PID`), delete `.next`, build plainly, then dev restart + `/api/health` → `{"status":"ok"}`.

**The gap:** the committed work gives **generic family-level looks** (all "corporate" templates share one style). The user wants each template to match **its specific newmodern mockup**. That requires per-template **palettes, fonts (~20 Google font families via `next/font/google` — allowed, not npm deps), and signature patterns** in the section components.

## 4. The plan (already written — follow it)

A new milestone was created: **`epics/14-template-modern-redesign/07-newmodern-reskin/`**
- `MILESTONE.md` — goal, binding mapping table, the `TemplateDesign` data model, seams, invariants.
- `01-design-data-and-fonts.md` — Phase 1 (fonts + `TemplateDesign` + catalog data + SiteRenderer palette spread + globals.css signature primitives + tokens helpers).
- `02-chrome-reskin.md` — Phase 2 (Header / Hero / Footer reskins per signature).
- `03-homepage-sections.md` — Phase 3 (Services / About / Testimonials / Cta / Contact).
- `04-aux-pages.md` — Phase 4 (Menu / Gallery / Faq / Hours / Pricing / Team).
- `05-demo-content.md` — Phase 5 (per-template bilingual demo copy aligned to newmodern personas).
- `06-thumbnails-and-polish.md` — Phase 6 (`preview.svg` ×10 + responsive/RTL pass + `quality-review.md`).

**The binding design source** (all exact hexes, fonts, signature CSS, header/hero/section/footer treatments): **`epics/14-template-modern-redesign/01-design-audit/newmodern-design-source.md`** (written this session). The audit report `01-design-audit/audit-report.md` was patched to note §3/§5 visual directions are superseded by this doc; the `TemplateTheme` axis model (§4.1), whitespace (§4.4), and primitives (§4.2) remain the engine contract.

**Execution order is strict:** 01 → 02 → 03 → 04 → 05 → 06. One subagent per task. Verify (lint + tsc + build + /api/health) between tasks.

## 5. Context for the next agent (what Hermes needs)

**Mandatory reading before any work** (per `AGENTS.md`):
1. `CODE_RULES.md` — IN FULL before writing code. §4 = no new npm deps (next/font/google is fine). §6 = i18n/RTL logical props only, no hardcoded strings. §8 = verification suite.
2. `epics/14-template-modern-redesign/07-newmodern-reskin/MILESTONE.md`.
3. Your single task file under that milestone.
4. `epics/14-template-modern-redesign/01-design-audit/newmodern-design-source.md` (binding design spec).

**Key engine files to not break:** `src/shared/site-render/SiteRenderer.tsx` (provider nesting, root div applies `site-body`/`site-surface-deep`/font/radius/`--brand`), `context.ts` (`useSiteStyle`), `tokens.ts`, `atoms.tsx`, and the section map/`SectionRenderProps` contract. `F`, `SlotImage`, `SampleTag` and edit-mode plumbing must never be rewritten. Redesigns happen **inside section-component files + additive globals.css/atoms/tokens + catalog.ts/demoContent.ts data**.

**Environment notes:** Windows / PowerShell 5.1. Working dir path contains spaces and OneDrive. Do NOT create/commit unless explicitly asked. Git repo is dirty with unrelated Epic-15/16 + `newmodern/` untracked — leave those alone.

## 6. Next actions (first thing in the new session)

1. Read the mandatory set (above).
2. Launch Phase 1 — task `07/01-design-data-and-fonts.md` as a `general` subagent (CODE_RULES + MILESTONE + task file + design source injected; require the build rule; instruct: no commits). Review its output, run the AC checks, then proceed task-by-task through 06.
3. Build rule discipline on every task.

## 7. Invariants (never violated — from Epic 14 + product)

- No structural/drag-and-drop editing surface; publishing vs editing stay separate; manually edited content never silently overwritten.
- Arabic is first-class RTL, never a translation skin. Latin display faces (Barlow Condensed, Fraunces, Playfair…) have no Arabic glyphs → must fall back to `--font-ar-serif`/`--font-ar-sans` via existing `:lang(ar)` rules.
- No new npm dependencies without explicit human approval (CODE_RULES §4).
- No hardcoded user-facing strings (all via translations/content, except `demoContent.ts` which IS site content).
- RTL-logical utilities only (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start/end`, `rtl:rotate-180`); never directional (`ml-*`, `text-left`, etc.).