# Task — Enrich Template Page Composition

## Title
Rework `buildPages()` in `src/features/templates/catalog.ts` so every template homepage has hero + services + about (+ testimonials, if any) + cta, and the about/services pages end with a CTA band.

## Context
Finding: 5/10 templates (`modern-studio`, `consultant-page`, `bistro-menu`, `simple-shop`, `clean-portfolio`) have home = hero + cta only; all secondary pages are single-section. The owner wants pages "more interesting". Reaching the target needs no new renderers — just section-list changes in one function.

## Scope
In `src/features/templates/catalog.ts`, modify `buildPages()` (only — keep `def()`, section builders, and the registry):
1. **Home**: change `const homeSections: TemplateSection[] = [hero];` into
   ```
   const homeSections: TemplateSection[] = [
     hero,
     buildServices(opts.svcCount),
     buildAbout(),
     ...(testi ? [testi] : []),
     cta,
   ];
   ```
   (adapt to the actual variable names already in the function). Ensure `testi` is only included when the template's `tes>0` — preserve that existing condition.
2. **About page**: `buildPages` pushes `[buildAbout()]` → `[buildAbout(), buildCta()]`.
3. **Services page**: `[buildServices(...)]` → `[buildServices(...), buildCta()]`.
4. Leave contact and all extra pages exactly as they are.
5. Do not reorder anything else; header/footer home wrappers stay.

## Dependencies
CODE_RULES.md; read `catalog.ts` `buildPages()` (lines ~290-351) and the `buildCta()`/`buildAbout()`/`buildServices()` builders (they already exist) before editing.

## Out of scope
New section types/pages/variants; renderer changes; `demoContent.ts` (task 02); the `newmodern/` reskin.

## Acceptance criteria
1. Every template's `def()` output now has home content = hero, services, about, [testimonials], cta (in that order); about/services pages = content + cta.
2. Templates without testimonials (`tes 0`) still omit testimonials from home.
3. `tsc --noEmit` + `npm run lint` pass; previews render without missing-field errors.