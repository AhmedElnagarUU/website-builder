# Task — New page-oriented section types

## Title
Add menu, gallery, faq, hours, pricing, team section types

## Context
Real websites have page-oriented content beyond one hero+services page: menus (restaurants), galleries (portfolios), FAQs, opening hours, pricing, and team members. These enable template-specific pages.

## Scope
Add six new `SectionType`s with fields + image slots registered in the semantic-key registry, plus matching renderer components under `src/shared/site-render/sections/`.

## Technical details
- Files: update `SectionType` in `src/features/templates/types.ts`, the registry in `src/features/templates/catalog.ts`, the `SECTION_COMPONENTS` map in `src/shared/site-render/SiteRenderer.tsx`, and add component files in `src/shared/site-render/sections/`.
- New types (register per-type fields/key constraints):
  - **menu** — `menu_title`, `menu_1_name`, `menu_1_desc`, `menu_1_price`, … (repeating), plus optional image slot.
  - **gallery** — `gallery_title` + N `gallery_{n}` image slots.
  - **faq** — `faq_title`, `faq_1_q`, `faq_1_a`, … (repeating accordion).
  - **hours** — `hours_title`, `hours_1_day`, `hours_1_time`, … (repeating list).
  - **pricing** — `pricing_title`, `pricing_1_name`, `pricing_1_price`, `pricing_1_features`, … (card list).
  - **team** — `team_title`, `team_1_name`, `team_1_role`, `team_1_image`, … (bio cards).
- Each reuses the rtlValidated + image-slot conventions; Arabic must look native, not a translation skin.
- Repeating fields follow the existing `service_{i}_*` / `testimonial_{i}_*` pattern with a count.

## Dependencies
- M03 task 01 (renderer accepts pages). M01 registry/model.

## Out of scope
- Wiring these into specific templates (M04 catalog pass). Image upload backend (deferred/S3).

## Acceptance criteria
- Each new section type has a renderer component, registry entry, and constraint keys.
- A template using a menu page on the About/Services style renders correctly on desktop + mobile and in EN + AR.
- No cross-page key duplication.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
