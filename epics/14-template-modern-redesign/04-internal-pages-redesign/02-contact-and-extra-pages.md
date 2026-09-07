# Task — Contact & Extra Pages

## Title
Redesign the Contact page and the category-specific extra pages (menu, gallery, faq, hours, pricing, team) per family.

## Context
Contact is the conversion page and the extras are what make each template feel like a real business category (a kitchen's menu, a shop's pricing, a studio's team). Today they all render through the same generic section bodies. This task gives each a deliberate composition while keeping the catalog's section set and fields.

## Scope
- `ContactSection` (Contact page role): compose into contact intro + contact card (localized labels from M02) + optional info/CTA. Families differentiate structure: `corporate` formal split, `warm` friendly card, `bold` dark paneled, `retail` clean split with store info, `creative` asymmetric contact. Fields: `contact_heading`, `contact_body` (unchanged).
- Extra pages (only where the template declares them):
  - `MenuSection` — elegant bilingual menu: item name/description/price rows with refined leaders (dotted lines), family typography; fields `menu_item_N_*`.
  - `GallerySection` — curated grid (bento where `creative`, clean uniform grid elsewhere); `gallery_N` slots.
  - `FaqSection` — grouped/accordion-look list (interactivity only if trivially supported — otherwise styled list); `faq_N_*`.
  - `HoursSection` — readable hours table (today + highlighted days if fields allow; otherwise styled list) using `site.days` labels; `hours_*`.
  - `PricingSection` — tier cards with a featured/CTA tier treatment driven by `accentRole`; `plan_N_*`.
  - `TeamSection` — cohesive member grid (portrait `SlotImage` treatment from the audit); `team_N_*`.
- All modernized through the M02 primitives; `SectionHead` everywhere; family variations via theme data + primitive props.

## Technical details
- No `F`/`SlotImage`/`SampleTag` contract changes; empty-field and upload affordances intact.
- No new catalog sections/fields; no new message keys beyond what M02 already added (if an unavoidable label appears, add to both locales).
- RTL + logical utilities; pricing featured tier must highlight without breaking the grid; hours must stay readable for Arabic day labels.
- Verify: `/preview/<id>/contact` + each extra slug per template that has it (see catalog table for which templates have menu/gallery/faq/hours/pricing/team).

## Dependencies
- M04 `01-about-and-services.md` (same component conventions). M02 primitives. Audit structures. CODE_RULES.md.

## Out of scope
- About/Services (previous task). Demo copy (M05). `preview.svg`. New fields/sections/dependencies.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass (build rule); `/api/health` ok.
2. Every extra page renders 200 for each template that declares it; fields present; localized day labels render for AR.
3. Contact page uses the localized labels (EN + AR spot-check in built HTML).
4. Family-distinct treatments per extra page (checked via class markers).
5. Logical utilities only; no overflow; deep surfaces legible.

## Definition of Done
- Verification green; per-family notes recorded in the return report.