# Task — About & Services Pages

## Title
Redesign the About and Services pages per family with purposeful compositions.

## Context
Every template ships About and Services pages that today are the generic shell: a centered "accent bar + title + paragraph" section and a uniform card grid. These are the most-clicked internal pages after the homepage and must demonstrate that the builder produces real pages — a coherent story on About, a clear offer on Services.

## Scope
- `AboutSection` (About page role): compose into intro/hero + story + values/stats, using `StatBlock`, `SectionHead`, and the theme's surface. Families differentiate: `corporate` editorial columns; `bold` dark, oversized pull-quote values; `warm` story with imagery and generous rhythm; `retail` approachable split with stats; `creative` asymmetric reveals. Fields: `about_title`, `about_body` (unchanged).
- `ServicesSection` (Services page role): overview + detailed service blocks (numbered rows, feature cards, or alternating image/text per family), process hints only if they fit existing fields without inventing new field keys — otherwise present the existing `service_N_*` fields more richly. Families differ in card sub-style and section-head alignment.
- Keep `hero section`? The pages currently list sections as declared in `catalog.ts`. Do not add/drop sections.
- Home page usage of the same sections (M03) shares components: if a family needs a different presentation on the About page, drive it via section-agnostic data (theme) or an explicit variant prop on the primitive — never via per-page copies of the component.

## Technical details
- Compose from `atoms.tsx` primitives only (`SectionHead`, `SiteCard` sub-styles, `StatBlock`, `CtaBand`).
- Page-hero roles: if the audit calls for a light page-intro for internal pages, implement inside the section (e.g. an enhanced server-rendered sub-header in the section component) without changing catalog data.
- Rhythm and RTL rules from M03/MILESTONE. Verify: `/preview/<template-id>/about` and `/services` per family (200, correct classes, both locales text present).
- No field/count changes; no new messages unless a new chrome label is genuinely unavoidable (then both locales).

## Dependencies
- M02 primitives; M03 homepage (family language established). Audit internal-page structures. CODE_RULES.md.

## Out of scope
- Contact + extras pages (next task). Demo copy (M05). `preview.svg`. New fields/sections.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass (build rule); `/api/health` ok.
2. `/preview/<id>/about` and `/preview/<id>/services` render 200 for all 10 templates; every About/Services section still renders its `F`-bound fields.
3. Each family's About and Services read distinctly (checked via built-HTML class markers per family).
4. No section is duplicated per page; both homepage and internal page reuse the same component files.
5. Logical-utilities-only; no horizontal overflow; deep surfaces legible.

## Definition of Done
- Verification green; per-family notes recorded in the return report.