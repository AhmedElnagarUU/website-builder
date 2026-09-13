# Task — Demo Content Adequacy for the Richer Composition

## Title
Verify (and where needed, fix) `demoContent.ts` so the new two-section pages and four-section home pages render real copy in both locales — no raw field-key fallbacks, no duplicated `pick()` items.

## Context
`buildPages()` (task 01) now reuses each template's `services` + `about` content **on the homepage as well as** their pages, and adds a `cta` band to about/services. Because the same section fields render in two places on different pages, the per-template demo arrays must be long enough that `pick()` never feeds a duplicate inside a single page, and must be populated for every template that now shows them.

## Scope
1. **Audit** `src/features/templates/lib/demoContent.ts`: confirm each of the 10 templates has populated `servicesItemNames/titles`, `about*`, and `cta*` arrays (they should — all templates already had full services/about/cta pages), and that `testimonial*` arrays match each template's `tes` count (≥ count, no duplicates within one page).
2. **Fix only if the audit finds gaps**: extend/shorten the affected arrays so counts hold (spot: services counts 2–4, testimonials 0–2). Keep the persona voices already in the file (do a per-template consistency pass only — do NOT rewrite existing persona copy wholesale).
3. **Verify end-to-end** (via `npm run build` + `next start -p 3001` or the dev server, whichever the dev server rule allows):
   - For at least the thin templates (modern-studio, consultant-page, bistro-menu, simple-shop, clean-portfolio), the built `/preview/<id>` HTML shows the ~4 home content sections with distinct text, and the AR pages show Arabic values only for those fields.
   - Grep built preview HTML for raw field keys (`f.key` style leaks like `services_title`) — allowed only if a field is genuinely unfilled *and* the template legitimately lacks demo data for it.
4. Do not change `LocaleDemo` shape, `demoForField`, or `buildTemplateDemo` signatures.

## Dependencies
CODE_RULES.md; task 01 (composition change applied first).

## Out of scope
Rewriting personas/copy; new fields; section renderer changes.

## Acceptance criteria
1. Every section field added by task 01 has demo values in both locales for all 10 templates (no raw key visible in built preview HTML for `services`, `about`, `cta`, `testimonials`).
2. `pick()` cycling check: for each template, each array that a page section consumes has `length >= count` and no repeated value within one page (services counts 2–4, testimonials 0–2).
3. `tsc --noEmit` + `npm run lint` + build pass; the thin templates' previews visibly gain sections.