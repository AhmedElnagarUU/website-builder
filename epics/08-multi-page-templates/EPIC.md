# Epic 08 — True Multi-Page Templates + Real Images + Enhanced Design

## Purpose (one line)
Move the site model from a single scrollable page to **real multi-page websites** (Home, About, Services, Contact, and template-specific pages like Menu/Gallery/Pricing), with realistic default pages, real stock images instead of SVG placeholders, and a stronger, more distinctive template design.

## Why this epic matters
Every real business website needs multiple pages — a tiny one-pager feels like a template, not a website. This is the largest and most architecturally significant post-MVP change: it reshapes the data model (template pages, per-page content, snapshots), the AI generation, the renderer, the live routing, and the editor. Done well, it dramatically raises perceived quality and is the foundation for the template gallery and analytics epics.

## Scope boundaries
**In:**
- Template model gains a list of **pages**, each with a canonical slug, a set of sections, and nav entries. A shared header/footer spans all pages.
- Content, live snapshot, editor, generation, and live routing become **per-page** (with a one-time migration of existing flat content into the Home page).
- Each template ships a default page set (Home always; About, Services, Contact; template-specific extras such as Menu, Gallery, FAQ, Pricing, Team, Hours).
- Replace SVG placeholder default assets with real, tasteful stock imagery (self-hosted or a licensed static source — no new runtime dep; see CODE_RULES §4).
- An intentional design pass so templates no longer look generic/templated.

**Out (handled elsewhere):**
- Template picker/gallery UI and editor picker redesign → Epic 09.
- Analytics pageview tracking → Epic 10 (this epic only changes the site model/routing).
- Structural/drag-and-drop editing — **permanently out, never add.**

## Milestones (in order)
1. **01-page-data-model** — add `pages` to `TemplateDefinition`; per-page `content`; snapshot carries pages; types updated.
2. **02-content-migration-and-routing** — one-time migration of existing flat content→Home; per-page generation; live routes `/live/[slug]/[lang]/[page]`.
3. **03-renderer-and-navigation** — render one page at a time with shared header/footer and active nav; multi-page sections (new section types: menu, gallery, faq, hours, pricing, team).
4. **04-template-catalog-v2** — default page sets per template + real stock images + design polish across all 10 templates.
5. **05-editor-per-page** — editor navigates/persists content per page.

## Cross-epic dependencies
- Depends on Epic 07 (fidelity fixes) being complete (opaque bg + responsive nav are prerequisites for a clean multi-page render).
- Epic 09 gallery and Epic 10 analytics consume this epic's richer model.
- Must NOT break the Epic 06 publish/live invariants (live URL serves exactly the last published snapshot; re-publish explicit; Arabic first-class RTL).
