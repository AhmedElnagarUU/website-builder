# Template Strategy & Audit — Monomastic

Date: 2026-09-26

## Current Inventory

### Catalog Templates (10, registered in `src/features/templates/catalog.ts`)

| Template | Category | Style | Sections | Extras |
|---|---|---|---|---|
| classic-services | services | corporate, warm palette | hero, services(3), about, testimonials(2), cta, contact | gallery(3), faq(4) |
| modern-studio | services | bold, dark, neon accent | hero, services(4), about, cta, contact | gallery(4), team(3) |
| warm-kitchen | restaurant | warm, serif, fire accents | hero, services(3), about, testimonials(1), cta, contact | menu(6), hours, gallery(3) |
| bistro-menu | restaurant | warm, sharp, gold hairlines | hero, services(4), about, cta, contact | menu(8), hours, faq(5) |
| simple-shop | retail | classic, green/clay palette | hero, services(3), about, cta, contact | gallery(3), faq(4), pricing(3) |
| product-focus | retail | modern, teal glow | hero, services(2), about, testimonials(1), cta, contact | gallery(4), pricing(3) |
| professional-profile | professional | classic, ledger/parchment | hero, services(3), about, testimonials(1), cta, contact | pricing(3), faq(5), team(3) |
| consultant-page | professional | bold, dark, amber | hero, services(4), about, cta, contact | pricing(4), faq(4), team(1) |
| clean-portfolio | portfolio | modern, contact-sheet | hero, services(2), about, cta, contact | gallery(6), team(3) |
| visual-showcase | portfolio | creative, warm, asymmetric | hero, services(3), about, testimonials(2), cta, contact | gallery(6), team(3) |

### Standalone Demo Websites (5, in `newmodern/websites/` — NOT catalog-driven)

- medical (8 pages: index, treatments, treatment-detail, about, patient-info, doctors, faqs, contact)
- construction (8 pages: index, industries, sustainability, services, about, project-detail, contact, projects)
- agency (7 pages: index, case-study, services, about, process, insights, work, contact)
- hotel (8 pages: index, experiences, about, room-detail, rooms, dining, gallery, contact)
- architecture (8 pages: index, services, project-detail, process, studio, journal, contact, projects)

### Category System (hardcoded 5)

`services`, `restaurant`, `retail`, `professional`, `portfolio`

## Coverage Against 17 Business Categories

| # | Business Category | Status | Evidence |
|---|---|---|---|
| 1 | Construction / Renovation | **GAP** | HTML demo only, no catalog template |
| 2 | Interior Design / Architecture | **GAP** | HTML demo only, no catalog template |
| 3 | Marketing / Creative Agencies | **PARTIAL** | modern-studio covers creatively; agency HTML demo separate |
| 4 | Consulting | **COVERED** | professional-profile + consultant-page |
| 5 | Law Firms | **GAP** | Nothing |
| 6 | Software / IT Agencies | **GAP** | Nothing |
| 7 | Photography / Creative Studios | **PARTIAL** | clean-portfolio + visual-showcase partially cover |
| 8 | Real Estate | **GAP** | Nothing |
| 9 | Clinics / Healthcare | **PARTIAL** | medical HTML demo; product-focus has clinical colors but no catalog template |
| 10 | Beauty / Fitness | **GAP** | Nothing |
| 11 | Education / Training | **GAP** | Nothing |
| 12 | Home Services | **COVERED** | classic-services demo content (Almada Home Services) |
| 13 | Automotive | **GAP** | Nothing |
| 14 | Events | **GAP** | Nothing |
| 15 | Restaurants / Cafés | **COVERED** | warm-kitchen + bistro-menu |
| 16 | Travel | **GAP** | Nothing |
| 17 | B2B / Professional Services | **PARTIAL** | professional templates lean consultant/individual, not B2B agency |

**Summary: 3 covered, 3 partial, 11 gaps.**

## Structural Problems

### 1. 5-category system cannot represent 17 business types
`CategoryId` is a hardcoded union of 5 values in `src/features/sites/types.ts`. Every template maps to exactly one category. This means a construction company has nowhere to go in the wizard.

### 2. No template archetypes — 1:1 template-to-category mapping
Each template is built for a single category. There are no reusable archetypes that can serve multiple business types. For example, "Professional Profile" and "Consultant Page" share 80% of their structure (hero → services → about → pricing → FAQ → team → contact) but are separate templates.

### 3. Rigid page structure
All templates use `buildPages()` which produces the same page skeleton: home (header + hero + services + about + testimonials + cta + footer), about, services, contact, plus extras. This guarantees consistency but prevents category-specific page patterns (e.g., a real estate site needs a "listings" page; a law firm needs "attorneys" and "practice areas").

### 4. Section types are fixed
`SectionType` in `types.ts` has 14 values: header, hero, services, about, testimonials, cta, contact, footer, menu, gallery, faq, hours, pricing, team. No section for: team members (law), practice areas (law), listings (real estate), classes (fitness), courses (education), portfolio items (photography), team + gallery combo (construction).

## Proposed Template Archetypes

Instead of 17+ category-specific templates, define **7 reusable archetypes** that compose differently per category. Each archetype is a named arrangement of sections that can be parameterized.

### Archetype A: "Service Hub"
**For:** Consulting, B2B agencies, software/IT, home services
**Pages:** Home → Services → About → Contact (+ FAQ, Pricing, Team)
**Signature:** Hero → service cards → about → testimonials → pricing → CTA → contact
**Parameters:** svcCount, hasPricing, hasTeam, hasFAQ
**Covers:** Consulting ✓, B2B/Professional ✓, Home Services ✓, Software/IT ✓

### Archeotype B: "Creative Showcase"
**For:** Marketing/creative agencies, photography, design studios
**Pages:** Home → Work → Services → About → Contact (+ Gallery)
**Signature:** Hero → work grid → services → about → CTA → contact
**Parameters:** workCount, hasGallery, hasTestimonials
**Covers:** Marketing/Creative ✓, Photography ✓, Creative Studios ✓

### Archeotype C: "Profile & Trust"
**For:** Law firms, doctors, individual professionals
**Pages:** Home → About → Services/Practice → Team → Contact (+ FAQ)
**Signature:** Hero → about → credentials → team → FAQ → CTA → contact
**Parameters:** hasTeam, hasCredentials, faqCount
**Covers:** Law Firms ✓, Clinics/Healthcare ✓, Professional ✓

### Archeotype D: "Visual Gallery"
**For:** Real estate, architecture, interior design, photography
**Pages:** Home → Gallery → About → Contact (+ Listings/Projects)
**Signature:** Hero → gallery grid → about → project/featured → CTA → contact
**Parameters:** galleryCount, hasProjectDetail, hasListings
**Covers:** Real Estate ✓, Architecture ✓, Interior Design ✓, Photography ✓

### Archeotype E: "Venue / Experience"
**For:** Restaurants, cafés, hotels, events
**Pages:** Home → Menu/Experiences → Gallery → Hours → Contact (+ FAQ)
**Signature:** Hero → highlights → menu/experiences → gallery → hours → CTA → contact
**Parameters:** hasMenu, hasHours, hasGallery, extraPage ("experiences" | "menu" | "rooms")
**Covers:** Restaurants ✓, Hotels ✓, Events ✓

### Archeotype F: "Product / Shop"
**For:** Retail, automotive parts, beauty products
**Pages:** Home → Products → About → Contact (+ Pricing, FAQ)
**Signature:** Hero → product grid → about → testimonials → pricing → CTA → contact
**Parameters:** productCount, hasPricing, hasFAQ
**Covers:** Retail ✓, Automotive (parts) ✓, Beauty (products) ✓

### Archeotype G: "Learn / Academy"
**For:** Education, training, fitness, beauty (services)
**Pages:** Home → Courses/Classes → About → Schedule → Contact (+ FAQ)
**Signature:** Hero → featured courses → about → schedule → testimonials → CTA → contact
**Parameters:** courseCount, hasSchedule, hasInstructors
**Covers:** Education ✓, Fitness ✓, Beauty (services) ✓

## Category → Archetype Mapping

| Business Category | Archetype | Notes |
|---|---|---|
| Construction / Renovation | D (Visual Gallery) + A (Service Hub) hybrid | Projects gallery + services |
| Interior Design / Architecture | D (Visual Gallery) | Gallery + project detail |
| Marketing / Creative Agencies | B (Creative Showcase) | Work + services |
| Consulting | A (Service Hub) | Services + pricing + FAQ |
| Law Firms | C (Profile & Trust) | Credentials + team + practice areas |
| Software / IT Agencies | A (Service Hub) | Services + team + pricing |
| Photography / Creative Studios | B (Creative Showcase) | Work + gallery |
| Real Estate | D (Visual Gallery) | Listings + property detail |
| Clinics / Healthcare | C (Profile & Trust) | Doctors + practice areas + hours |
| Beauty / Fitness | G (Learn / Academy) | Classes + schedule + instructors |
| Education / Training | G (Learn / Academy) | Courses + schedule |
| Home Services | A (Service Hub) | Services + FAQ + hours |
| Automotive | F (Product / Shop) | Parts/products + pricing |
| Events | E (Venue / Experience) | Gallery + hours + FAQ |
| Restaurants / Cafés | E (Venue / Experience) | Menu + hours + gallery |
| Travel | B (Creative Showcase) or E hybrid | Destinations + experiences |
| B2B / Professional Services | A (Service Hub) | Services + team + pricing |

## Recommended Actions (Priority Order)

### Phase 1 — Expand categories (highest impact)
1. Add 12 new category IDs to `CategoryId` union and `CATEGORY_IDS` array
2. Add `categories` field to `TemplateDefinition` (currently single string → array)
3. Map each existing template to its real business category, not just the template file name
4. Update `categories.ts` keywords for broader matching

### Phase 2 — Fill gaps with archetype-driven templates
5. Create **construction** template: archetype D+A, 3-4 services, project gallery, about, contact
6. Create **architecture/interior** template: archetype D, gallery-heavy, project detail, studio page
7. Create **law firm** template: archetype C, practice areas, attorney team, FAQ, contact
8. Create **software/IT** template: archetype A, services + pricing, team, FAQ
9. Create **real estate** template: archetype D, listings, property detail, agents
10. Create **beauty/fitness** template: archetype G, classes, schedule, instructors
11. Create **education** template: archetype G, courses, schedule, FAQ
12. Create **automotive** template: archetype F, products, pricing, FAQ
13. Create **events** template: archetype E, gallery, hours, FAQ
14. Create **travel** template: archetype B hybrid, destinations, experiences

### Phase 3 — Structural improvements
15. Add missing section types: `listings`, `practiceAreas`, `classes`, `projects`, `testimonials` (already exists)
16. Consider per-archetype page generation rules instead of one-size-fits-all `buildPages()`
17. Add `templateArchetype` field to `TemplateDefinition` for client-side filtering

### Phase 4 — Demo content
18. Add demo content entries for each new template in `demoContent.ts`
19. Add real images to `public/templates/real/<new-template>/`
20. Add preview SVGs to `public/templates/<new-template>/preview.svg`

## What NOT to Build
- No orders, CRM, inventory, payment flows, or business-management features
- No complex multi-step booking systems
- No e-commerce checkout (simple pricing/contact is the ceiling)

## Risks
- Expanding `CategoryId` is a schema change — requires migration if sites already exist in DB
- Too many archetypes can over-engineer; start with the 4 biggest gaps (construction, law, real estate, education/fitness)
- Each new template needs RTL validation + demo content in both languages
