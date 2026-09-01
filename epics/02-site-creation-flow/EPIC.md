# Epic 02 — Site Creation Flow: Business Info → Templates → Language

**One-line purpose:** Take a signed-in user from "I need a website" through the three input steps of the core journey — business facts, template pick, language choice — producing a persisted draft website record ready for AI generation.

## Why this epic matters for the MVP

This is Steps 1–3 of the core user journey (the only steps requiring real user input before AI takes over). It also establishes the **site data model** and the **template library** — two foundations that AI generation (Epic 03), editing (Epic 04), publishing (Epic 05) and the dashboard (Epic 06) all consume. A key PRD decision baked in here: content is modeled as **semantic fields independent of any template**, which later enables template switching without data loss.

## Scope boundaries

**In scope**
- Canonical `sites` MongoDB model + repository + create/get APIs.
- Draft lifecycle & step tracking (`currentStep`) enabling abandon/resume.
- Step 1 screen: grouped business-info form with autosave; searchable category select; required = name + category only.
- Template library: definition format, 10 seeded templates across 5 categories, preview assets, category-matched listing API.
- Step 2 screen: template selection grid (matched first, "see all"), plain-language descriptions.
- Step 3 screen: language choice (EN / AR / Both) with location-based default suggestion, explicit confirmation.

**Out of scope**
- Anything AI/generation (Epic 03).
- Editing/preview UI (Epic 04).
- Publishing (Epic 05), dashboard listing/management (Epic 06).
- Changing languages AFTER generation exists (Epic 05 site settings).
- Template switching AFTER generation exists (Epic 04).

## Milestones (in execution order)

| # | Milestone | One-line description |
|---|---|---|
| 01 | `01-site-data-model/` | Canonical sites schema/repository + create/fetch draft APIs. **Contains the canonical data model — read it even if your task is elsewhere in this epic.** |
| 02 | `02-business-info-step/` | Business info form UI + its save API. |
| 03 | `03-template-library/` | Template definition format, seed library, listing API, selection screen. |
| 04 | `04-language-choice/` | Language config API + choice screen with default suggestion. |

## Cross-epic dependencies

Depends on ALL of Epic 01 (app runs, i18n works, auth works, shell exists). Epic 03+ depend on this epic.
