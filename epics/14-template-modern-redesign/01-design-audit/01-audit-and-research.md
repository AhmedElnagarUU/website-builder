# Task — Template Audit & Design Research

## Title
Audit all templates, research modern professional design principles, and produce the binding `audit-report.md`.

## Context
Before redesigning anything we must know precisely what reads as "basic/generated" today and what modern professional sites do instead. This document-only task turns research and analysis into the contract that all redesign milestones implement. It also de-risks M02+ by deciding, up front, which template gets which design language.

## Scope
- Read every section component under `src/shared/site-render/sections/` and render them mentally against: (a) `src/features/templates/catalog.ts` (all 10 templates, their pages/sections/counts), (b) `src/shared/site-render/tokens.ts`, (c) `src/features/templates/lib/demoContent.ts`, (d) the Tailwind/global tokens in `src/shared/ui/fonts.ts` and `globals.css`.
- Perform external design research using web search on reputable template/marketplace/agency sources (Webflow, Awwwards, Framer, modern SaaS/agency/business/portfolio sites). Extract principles, not designs to copy.
- Produce `epics/14-template-modern-redesign/01-design-audit/audit-report.md`.

## Technical details
- The report must contain, in order:
  1. **Method** — what was read, what was researched, dates.
  2. **Principles** — 6–10 concrete "why modern professional sites look professional" principles (visual hierarchy, whitespace, typographic scale, section rhythm, CTA hierarchy, image treatment, borders/shadows, motion/states), each with a 1–2 sentence justification grounded in the research.
  3. **Per-template audit** (×10) — for each of `classic-services`, `modern-studio`, `warm-kitchen`, `bistro-menu`, `simple-shop`, `product-focus`, `professional-profile`, `consultant-page`, `clean-portfolio`, `visual-showcase`: current problems (visual/structural/missing sections/typo/spacing/responsive/content/repetition), keepers, and the concrete redesign direction.
  4. **Design system plan** — reusable primitives to build (section head variants, CTA band, card family, stat/testimonial/project/faq patterns, hero variants, header/footer), plus the typographic scale (heading sizes/weights/tracking per role: hero, section, sub, body, label) and whitespace/rhythm system (spacing scale, section padding rhythm, content max-width), all in exact Tailwind class terms where possible.
  5. **Theme assignments** — the binding table below, restated with one short justification per template and 4–6 named design decisions per family (palette direction, type treatment, hero behavior, accent usage, signature element).
- **Theme assignments (binding, do not change):**

| template | key | surface | headingFont | hero | accentRole |
|---|---|---|---|---|---|
| classic-services | corporate | light | serif | split-light | fill |
| professional-profile | corporate | light | serif | split-light | edge |
| modern-studio | bold | deep | sans | split-deep | edge |
| consultant-page | bold | deep | sans | split-deep | fill |
| warm-kitchen | warm | light | serif | photo-bleed | fill |
| bistro-menu | warm | light | serif | split-light | edge |
| simple-shop | retail | light | sans | split-light | fill |
| product-focus | retail | light | sans | photo-bleed | edge |
| clean-portfolio | creative | light | sans | split-light | edge |
| visual-showcase | creative | deep | sans | photo-bleed | fill |

- Sketch each hero and homepage section-flow as short ASCII wireframes per family so M03/M04 can implement without re-deciding layout.
- Note any engine limitation discovered during the audit that genuinely blocks a desired direction — document precisely (file:line, why it blocks, smallest fix) so M02 can make the smallest architectural change.

## Dependencies
- None beyond reading CODE_RULES.md and this file. No build/verification required (no code).

## Out of scope
- No code changes of any kind; no `catalog.ts`, `tokens.ts`, `globals.css`, section or content edits; no files outside `epics/14-template-modern-redesign/01-design-audit/`.
- No screenshot generation; no new image assets.

## Acceptance criteria
1. `audit-report.md` exists at the specified path and contains all five sections above.
2. The 10-template theme assignment table matches the binding table exactly.
3. At least 6 researched principles, each concrete and grounded, not borrowed from a single source.
4. Every template has an explicit "must fix" and "must keep" list; nothing is "everything is fine".
5. ASCII wireframes exist for each family's hero + homepage flow.
6. A documented-engine-limitations section exists (even if concluded as "none blocking").

## Definition of Done
- CODE_RULES.md followed (no code written, so §6/§8 non-applicable beyond "no new deps").
- Report is self-contained: any engineer reading only it + the M02 task files can implement the redesign without re-reading this task.