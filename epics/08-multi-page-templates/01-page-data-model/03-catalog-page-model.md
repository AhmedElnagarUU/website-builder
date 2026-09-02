# Task — Refactor the catalog to build page lists

## Title
Refactor `catalog.ts` so the 10 templates produce per-page definitions

## Context
The template catalog builds a flat `sections` list per template via helper builders (`buildHeaderSection`, `buildHeroSection`, …, `buildFooterSection`). With pages, each template instead describes pages (Home, About, Services, Contact) that group those sections, with header/footer shared site chrome.

## Scope
Refactor `catalog.ts` to output `pages` per the new model. Establish the **baseline page set** used by all templates in this milestone (Home + About + Services + Contact); template-specific extra pages (Menu, Gallery, Pricing, FAQ, Team, Hours) and the design/image enhancements come in M04.

## Technical details
- File: `src/features/templates/catalog.ts` (and `types.ts` as needed).
- Reuse the existing section builders but assign sections under pages. Example baseline:
  - **Home** (`id:"home"`, `slug:""`, nav:true): hero + about teaser + services preview + cta + a few testimonials.
  - **About** (`id:"about"`, `slug:"about"`, nav:true): about section (full) + team/image.
  - **Services** (`id:"services"`, `slug:"services"`, nav:true): services section (full) + cta.
  - **Contact** (`id:"contact"`, `slug:"contact"`, nav:true): contact section + footer-adjacent info.
- Keep nav field keys (`nav_home`, `nav_services`, `nav_about`, `nav_contact`) mapped to page labels vs current section labels, and preserve the semantic-key registry (each key owned once).
- All 10 templates must compile with the new `pages` shape.

## Dependencies
- M01 tasks 01 and 02 (types + content per-page).

## Out of scope
- New section types (menu/gallery/faq/etc.) → M03/M04.
- Real images and design polish → M04.
- Generation and live routing → M02/M03.

## Acceptance criteria
- All 10 templates define `pages` with the baseline 4-page set and compile.
- No template references a removed flat `sections` API.
- Semantic-key registry invariant holds (no key duplicated across pages).

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean.
