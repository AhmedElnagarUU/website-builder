# Task — Per-Template Bilingual Demo Content (newmodern)

## Title
Update `demoContent.ts` so each of the 10 templates has realistic, bilingual (EN+AR) demo businesses/copy that matches its newmodern brand persona (Redline, Volatile, Ember & Oak, The Meridian, Arbor & Clay, Clearview, Harlan & Co, Ironclad, Mara, Atelier Voss).

## Context
Committed demo content already gives each template a distinct business and Arabic-native copy (origin "placeholder"), but it does not match the newmodern personas. This task aligns names, values, services, menu items, testimonials, FAQ, team, hours, and pricing copy to the binding personas so previews feel like the mockup sites.

## Scope
- **`src/features/templates/lib/demoContent.ts`** — for each of the 10 templates, update/replace the per-template demo consts to the newmodern business:
  - classic-services → home-repair/trades company (Redline-style; "the crew you call when it matters", same-day dispatch, licensed crews, honest estimates; service list 01–06 with `from $X`; marquee trades; work-order motifs; CTA "Request a Visit"...)
  - modern-studio → bold creative agency (Volatile-style; "we don't do safe", LA, est. 2018; stats 120+ projects, 18 creatives; services preview rows 01–06)
  - warm-kitchen → wood-fired trattoria (Ember & Oak-style; forno, fire readout, tonight's table, menu segments, reserve CTA)
  - bistro-menu → luxury caldera resort (The Meridian-style; 47 suites, rooms from €890, dining, experiences, parallel quote)
  - simple-shop → plant/ceramics shop (Arbor & Clay-style; specimen arrays, care tags, kiln, care teaser 001–004, visit strip)
  - product-focus → modern dental/wellness clinic (Clearview-style; 15,000+ patients, 11 years, treatments, why-choose-us rows, team, testimonials 4.9★)
  - professional-profile → chartered accountants (Harlan & Co-style; ledger stats 412 businesses, 100% audits, 52 years; services "Four ledgers, one ethic."; filing cards; "Begin a conversation")
  - consultant-page → commercial construction firm (Ironclad-style; est. 1987, 800+ team, 37 completed / $2.4B / 2.1M sqft stats; services; projects $180M/$95M/$62M; "Ready to Build")
  - clean-portfolio → documentary photographer portfolio (Mara-style; plates 01·12, contact-sheet index 008–019, essay titles, statement "the ordinary world, shot like it matters")
  - visual-showcase → architecture & interior studio (Atelier Voss-style; est. 2009 NY; "Spaces that endure"; projects NY 2024; 156/24/15/8 counters; journal)
- Keep the existing scaffold (`LocaleDemo`, `demoForField`, `pageFields`, `buildTemplateDemo`, `pick()`), `origin: "placeholder"`, field keys, and per-template counts unchanged. Arabic translations are Arabic-native (not transliterations) and provided in the same style as the current file; heads-up the AR must degrade gracefully (mono/display Latin faces absent → Arabic stacks).
- Any translations you add to the *products* (labels like "View all services") that are new UI strings must go through messages files only if they already exist; this task is content, not UI — hardcoded new panel copy is allowed only inside `demoContent.ts` (it is the site's *content*, not the product UI).

## Technical details
- Read `01-design-audit/newmodern-design-source.md` for the personas + exact phrasing/signature copy ideas. Read `07/MILESTONE.md`. Read current `demoContent.ts` to reuse its structure and strategies (bilingual, seeded variation, no lorem).
- Do not touch `catalog.ts` or `buildPages`; do not change field keys or counts. Only values (names, titles, descriptions, testimonials, FAQs, plans, team, hours, menu items, prices).
- RTL: Arabic copy is first-class (written in Arabic, not English-back-transliterated).
- KISS: single source of truth remains `demoContent.ts`; no duplication elsewhere.

## Dependencies
- `newmodern-design-source.md`. CODE_RULES.md. (Section components from 02–04 already wired — this task just feeds them the right copy.)

## Out of scope
- Section components, engine, catalog structure, messages files (product UI strings — leave them), `preview.svg`, new npm deps.

## Acceptance criteria
1. lint + tsc + build green; `/api/health` ok after restart.
2. `grep -c "Demo Business" src/features/templates/lib/demoContent.ts` → 0; `grep -c "نشاط تجريبي|Lorem"` → 0.
3. Each template const now reflects its newmodern business (spot-read at least classic-services, warm-kitchen, consultant-page, clean-portfolio, visual-showcase).
4. `/preview/<id>` EN and `/ar/...` AR render the business name/values correctly (both locales) for ≥3 templates.
5. No field-key/count drift (`svcCount`, `itemCount`, `faqCount`, `planCount`, `memberCount` unchanged vs catalog).

## Definition of Done
- CODE_RULES; suite green; all five acceptance criteria verified; demo copy is realistic, persona-aligned, and bilingual (EN+AR) against the mockup personas.