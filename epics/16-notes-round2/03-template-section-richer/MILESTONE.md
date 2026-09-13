# Milestone 03 — Richer Template Websites

## Goal
No template's homepage may show only 2 content sections, and secondary pages should feel complete. Achieved purely through **composition** in `catalog.ts` `buildPages()` — no new section types, no renderer work, no new pages.

## Tasks (execution order)
1. **01-enrich-composition.md** — Change `buildPages()` so every home page carries hero → services → about → (testimonials) → cta, and about/services pages end with a CTA band.
2. **02-demo-content-adequacy.md** — Verify each template's `demoContent.ts` arrays cover the new section counts (no field falls back to a raw key), fix any short arrays, and confirm previews render the richer pages.

## Shared context (binding for this milestone)
- Current composition (`src/features/templates/catalog.ts` `buildPages()`, lines ~290-351): home = hero + (testimonials if `tes>0`) + cta; every secondary page = exactly one section.
- **Binding target composition:**
  - **Home**: `[header, hero, services, about, testimonials (only when the template has testimonials), cta, footer]` — note the destination order: `services` and `about` go **between** hero and the (optional) testimonials, cta stays last.
  - **About page**: `[about, cta]`. **Services page**: `[services, cta]`. Contact + extra pages (menu/gallery/faq/hours/pricing/team) unchanged (single section).
  - Reuse the existing `buildServices(opts.svcCount)` / `buildAbout()` / `buildTestimonials()` builders — do not create new builders or section variants.
- All 14 section types have renderers and registered `REGISTRY` field keys. `demoContent.ts` already carries services/about/cta data for every template; testimonials only for templates with `tes>0`. The `pick()` cycling rule means every array used per section must be ≥ the section's count so no duplicate item repeats within one template.
- This milestone deliberately does NOT touch the `newmodern/` reskin (separate mission) — it only thickens composition with existing look-and-feel.

## Verification (end of milestone)
`/preview/<template-id>` home shows ≥ 4 content sections and no field-key leaks; about/services pages show two sections ending in a CTA; `tsc` + `lint` + build pass; both locales render.