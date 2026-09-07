# Task — Homepage Section Composition

## Title
Redesign the homepage section flow (social proof, features/services, stats, testimonials, FAQ, CTA) per family using the M02 primitives.

## Context
The home page currently is `header → hero → testimonials → cta → footer` with every section wearing the same "accent bar + centered title + card grid" outfit. This task composes the homepage sections into a deliberate, rhythmic flow per family so the page reads as a real landing experience — while keeping the exact same section set and field keys.

## Scope
- `ServicesSection` (homepage features/services) — re-skin using `SiteCard` (feature sub-style) + `SectionHead`; differentiate family treatments: `corporate` numbered/editorial list, `bold` offset bold cards with edge accents, `warm` soft rounded generous cards, `retail` product-led cards w/ imagery emphasis, `creative` bento/asymmetric grid. Keep `svcCount` and `service_N_title/description` fields.
- `TestimonialsSection` — `SiteCard.testimonial` with family variants (quote glyph, author treatment); keep count + `testimonial_N_*` fields.
- `CtaSection` — replace inline implementation with `CtaBand` (accent-role-aware). Keep `cta_headline`/`cta_button_label` + contact link behavior.
- `AboutSection` (homepage presence): re-compose from one-column wall of text into a richer composition (intro paragraph + a pull stat or image pairing) using `StatBlock`/`SiteCard` where the audit calls for it; keep `about_title`/`about_body`.
- Add `StatBlock`-based social-proof strip and an FAQ presence **only where the template already has those sections/fields** — creating NEW homepage sections means adding catalog data; allowed only if the audit explicitly recommends it AND the orchestrator (execution prompt) approved it. Otherwise, enrich existing sections only. Default: enrich existing sections only.
- Footer already handled in M02; keep consistent with the redesigned hero (no new footer work unless audit says otherwise).
- Preserve section order (catalog array order), header-from-home chrome, and every render-mode contract.

## Technical details
- Compose exclusively from primitives in `atoms.tsx`; variations come from passing style/variant props, not from copy-pasting card markup per section.
- Rhythm: audit spacing scale → section paddings (`py-*`), internal gaps, and alternating visual weight; sections must not all be the same height/shape.
- Deep-surface templates: `CtaBand` and cards must stay legible on the dark palette (verify contrast against the M02 surface vars).
- RTL: mirror asymmetric layouts with logical utilities; arrows/oversized glyphs flip (`rtl:rotate-180`).
- Verify per family on `/preview/<id>`; record before/after per family in the return report.

## Dependencies
- M03 `01-hero-and-chrome.md` (hero live, verified). M02 primitives. Audit homepage wireframes. CODE_RULES.md.

## Out of scope
- Internal pages (M04). Demo copy (M05). Changing field keys/counts of existing sections. Adding uncataloged homepage sections. `preview.svg`.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass (build rule); `/api/health` ok.
2. Each of the five families' home page is visually distinct: spot-check HTML/classes at `/preview/<id>` for each family and confirm family-specific treatments (e.g. corporate numbered list vs creative bento classes).
3. Every existing homepage section renders with primitives (grep: `SectionHead|CtaBand|SiteCard|StatBlock` present in the relevant sections; no section re-implements an equivalent inline).
4. No section dropped fields: homepage `F`-rendered titles/bodies/CTAs present in built HTML per template.
5. No horizontal overflow offenders in the new markup (logical utilities only); dark families legible.
6. `cta_button_label` still links to contact page in view mode and `onNavigatePage` in edit mode.

## Definition of Done
- Verification suite green; per-family review recorded (classes used, what reads strongest, one "needs a human eye" note each); regeneration (demo rebuild) not required for this milestone — content unchanged (M05).