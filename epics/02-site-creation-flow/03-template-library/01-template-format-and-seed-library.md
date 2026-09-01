# Task 01 — Template definition format & seed library

## Context

Templates are the product's core IP: they make every design decision so the user never has to. Each template is a typed data object (fixed sections, fixed order, fields with constraints) — not a page of HTML. This task creates the format and the 10 launch templates exactly as specified in this milestone's `MILESTONE.md` (read it first: it contains the full TS interfaces, semantic key registry, and the 10-template table with per-template variations).

## Scope

- `src/features/templates/types.ts` — every interface from the milestone, verbatim.
- `src/features/templates/catalog.ts` — exports `TEMPLATES: TemplateDefinition[]` containing all 10 seed templates from the milestone table, each fully specified:
  - All sections present per table (header/hero/services/about/testimonials?/cta/contact/footer).
  - Fields use ONLY registry keys; purposes written as clear English AI instructions; constraints from the registry.
  - `rtlValidated: true`, sensible `defaultAccent` hex per template, style tokens set.
- Preview SVGs at `public/templates/{id}/preview.svg` for all 10 — simple but representative mockups with realistic category sample copy (real-sounding service names/dishes), correct template accent color.
- Default slot images at each slot's `defaultAsset` path (can be clean gradient/patterned SVG placeholders per category).

## Technical details

- Pure data module — no I/O, no DB.
- Keep each template readable: one clearly-sectioned object; a small factory helper is allowed if it reduces repetition without hiding structure (KISS — prefer explicit objects over clever builders).
- Purposes must be self-explanatory because Epic 03 feeds them verbatim into generation prompts.

## Dependencies

- `epics/02-site-creation-flow/03-template-library/MILESTONE.md`
- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md` (CategoryId enum source)

## Out of scope

- Any API route (Task 02) or UI (Task 03).
- Renderer implementation (Epic 04 consumes these definitions).
- FAQ fields (cut for MVP).

## Acceptance criteria

- [ ] `TEMPLATES.length === 10`; each id/name/categories match the milestone table.
- [ ] Every field key across all templates exists in the Semantic Key Registry; constraints match registry limits.
- [ ] Every `service_N_*` pair count equals the template's `svcCount`.
- [ ] All 10 preview SVGs exist and render realistic (non-lorem) copy when opened in a browser.
- [ ] TypeScript compiles with strict typing — no `any`.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; catalog is pure data; no new dependencies.
