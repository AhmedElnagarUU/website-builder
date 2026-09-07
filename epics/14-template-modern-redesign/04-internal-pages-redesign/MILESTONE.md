# Milestone 04 — Internal Page Redesign

## Goal
Give every non-home page a meaningful, purpose-appropriate composition (no more "title → paragraph → cards") while staying visually consistent within each template's family — so no two pages of the same template feel like clones.

## Tasks (execution order)
1. **01-about-and-services.md** — About + Services pages redesigned per family.
2. **02-contact-and-extra-pages.md** — Contact + menu/gallery/faq/hours/pricing/team pages redesigned per family.

## Shared context (binding for this milestone)
- Composes exclusively from M02 primitives; pages read `useSiteStyle().theme`. All pages keep the same `TemplateSection` sets, per-section field keys, and counts (`svcCount`, `itemCount`, `faqCount`, `planCount`, `memberCount`) exactly as declared in `catalog.ts` today — redesigning presentation only.
- Internal pages share one design language with their family's homepage: same header/footer (home chrome), same type scale, same spacing rhythm, same accent role, same surface.
- Page-specific compositions (from the audit's internal-page structures) must feel deliberate: e.g. About = intro hero + story + stats + values; Services = overview + detailed service blocks + process; menu = elegant list with prices; pricing = comparison-tier cards; team = portrait grid; gallery = curated grid.
- Distinction requirement per template: two sibling pages must not use the same layout-washed-out-with-different-text. Reuse patterns across families where a pattern genuinely fits, but encode family differences (section-head alignment, card sub-style, surface) through theme data, matching the audit.
- Preview verification surface: `/preview/<template-id>/about`, `/services`, `/contact`, and `/menu`, `/gallery`, `/faq`, `/hours`, `/pricing`, `/team` where the template has them (see the catalog template table).
- Build rule per M02 MILESTONE.md; edit-mode contracts (F/SlotImage/SampleTag) survive.