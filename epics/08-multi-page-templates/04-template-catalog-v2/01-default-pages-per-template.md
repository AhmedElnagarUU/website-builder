# Task — Default page set per template

## Title
Assign category-appropriate default pages to each of the 10 templates

## Context
Each template should ship a sensible, real default page set so generated sites feel like actual websites, not one-pagers. All get Home + About + Services + Contact; category-specific ones add extras (e.g. Warm Kitchen & Bistro get Menu; Clean Portfolio & Visual Showcase get Gallery; consultants get Pricing/FAQ/Team).

## Scope
For each of the 10 templates in `catalog.ts`, define its `pages` list using the baseline pages (M01 task 03) plus extras wired from the new section types (M03 task 02). Set nav labels via `BilingualText` (EN+AR).

## Technical details
- File: `src/features/templates/catalog.ts`.
- Suggested mapping (adjust sensibly):
  - services/restaurant/retail/professional/portfolio all get Home/About/Services/Contact.
  - restaurant (warm-kitchen, bistro-menu): + **menu**, **hours**, **gallery**.
  - portfolio (clean-portfolio, visual-showcase): + **gallery**, **team**.
  - professional (professional-profile, consultant-page): + **pricing** (or services), **faq**, **team**.
  - retail (simple-shop, product-focus): + **gallery**, **faq**, **pricing**.
- Keep the shared header/footer as site chrome (not per-page). Only `nav:true` pages appear in the nav menu, in order.
- Ensure semantic-key registry remains single-source-of-truth and each key is owned by exactly one page.

## Dependencies
- M03 task 02 (new section types). M01 task 03 (page model). M02 (generation handles the pages).

## Out of scope
- Image replacement (task 02), design polish (task 03).

## Acceptance criteria
- Each of the 10 templates has a distinct, sensible page set; extras match its category.
- Nav shows the intended pages in order (EN + AR labels).
- No duplicated field keys across pages; `npx tsc --noEmit` passes.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
