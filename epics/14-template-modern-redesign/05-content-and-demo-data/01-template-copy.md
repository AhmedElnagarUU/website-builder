# Task — Per-Template Demo Copy (EN + AR)

## Title
Write realistic, per-template bilingual demo copy for all 10 templates in `demoContent.ts`.

## Context
The redesign milestone-02–04 make templates *look* professional; this milestone makes them *read* professional. Today `demoContent.ts` serves a single generic fictional business ("Demo Business / نشاط تجريبي", generic service copy) across every template, which undercuts the new visuals and makes previews feel like the same site with different paint.

## Scope
- Rewrite the EN + AR demo copy in `src/features/templates/lib/demoContent.ts` so each template's persona, hero, services, about, testimonials, CTA, footer, and extra-page content (menu/gallery/faq/hours/pricing/team) match its identity from the audit report.
- Keep the file structure: same `LocaleDemo` shape, `demoForField` mapping, `pageFields`, `buildTemplateDemo` signature, `TemplateDemo` return type, and both-locales population. Only the *values* change (plus any internal restructuring that stays KISS).
- Ensure array lengths ≥ each template's actual counts so `pick()` never cycles a duplicate inside one template (compute per template; e.g. services across templates is 2–4, testimonials 0–2, menu 6–8, faq 4–5, plans 3–4, team 1–3, gallery titles 1).
- **Copy persona per template** (from the audit; implement the details the audit specifies):
  - classic-services → traditional general-services firm (cleaning/repairs) with trust-first messaging.
  - professional-profile → an executive/consultant personal brand (coaching/leadership), credible and calm.
  - modern-studio → bold digital/product studio (design + build), confident, outcome language.
  - consultant-page → strategy/finance consultant with process + results framing.
  - warm-kitchen → neighborhood restaurant, seasonal home-style menu, warm inviting tone.
  - bistro-menu → refined bistro, ingredient-forward menu, elegant concise tone.
  - simple-shop → approachable retail store/boutique, product-value tone.
  - product-focus → a single product/device brand, feature- and spec-aware copy.
  - clean-portfolio → freelance designer/art-director portfolio, tasteful, work-first.
  - visual-showcase → photographer/visual creator showcasing a signature body of work.
- Each template's AR copy must be a real Arabic rewrite (idiomatic, RTL-native) — use the AR translation samples already in the file as tone references; produce proper Arabic for every field including menu items, FAQ answers, and team bios. Use zero hardcoded Latin text in AR values.
- Keep `contactPhone/contactEmail/category/location` fields realistic-but-fictional per template (plausible country formatting matching a plausible city; e.g. Cairo/KSA/Gulf formats for AR-appropriate businesses where the audit picks one).

## Technical details
- This milestone touches only `demoContent.ts`. Do not modify the redesigned sections or catalog.
- After editing, verify no `f.key` raw fallbacks leak into previews: built preview HTML must contain no literal field-key strings (e.g. `hero_headline`) for any handled key — scan built HTML for field-key names.
- Confirm both locales render: `/preview/<id>` and a couple of subpages show Arabic copy correctly under `?locale`— the shell defaults EN; toggle is client-side, so also confirm AR strings exist in bundled messages/demo (spot-check HTML for at least one AR string per template from the JS payload or the AR demo export via a tiny `node -e` script is fine — do NOT commit scripts).

## Dependencies
- M01 audit persona sections. M04 completed (pages live). CODE_RULES.md.

## Out of scope
- Section/components/catalog changes. Messages files. New assets. Screenshot/thumbnail changes.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass (build rule); `/api/health` ok.
2. Every template's home preview HTML contains its specific business name (not "Demo Business") and unique hero headline.
3. No field-key fallback strings appear in any built preview HTML.
4. All 10 templates carry distinct copy (diff-style spot check: at least the hero headline + business name differ across all 10).
5. Menu/pricing/hours/etc. content present and non-generic for each template that has them; AR values present and Arabic-only for those fields.
6. `pick()` no longer cycles duplicates for any template's declared counts (checked programmatically via the counts in catalog).