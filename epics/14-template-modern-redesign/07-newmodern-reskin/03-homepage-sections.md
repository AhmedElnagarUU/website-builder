# Task — Homepage Content Sections Reskin (services / about / testimonials / cta / contact)

## Title
Redesign the content sections that appear on home + internal pages (Services, About, Testimonials, CTA band, Contact) so each template expresses its newmodern signature (ticket rows, ledger rows, specimen cards, contact-sheet grid, gold-lines, etc.).

## Context
Chrome (02) is done. These five sections carry most of the "look" of a real professional site body. Each newmodern mockup treats them distinctly; this task reproduces those signatures per template while keeping the committed engine contract and edit-mode affordances.

## Scope
- **`ServicesSection.tsx`** — per-signature service presentation:
  - classic-services → dotted-leader index rows (mono signal numbers 01–…, condensed titles, `from $X`, `border-t border-ink/15`) or ticket-like feature cards
  - professional-profile → ledger lentry rows (serif title, fragment-mono memo, tabular amount) inside a `.ledger` card
  - simple-shop → specimen cards (herbarium label, latin italic, price, care tags)
  - modern-studio → numbered rows 01–06 with border-y hairlines; consultant-page → stat-border service cards
  - warm-kitchen → menu-lead dotted rows in coal cards (feature card)
  - bistro-menu → elegant dotted-leader rows with flared prices (gold/bar red tone)
  - product-focus → rounded 12px service cards with teal icon hover flip
  - clean-portfolio → bento project/feature cells (keep existing bento but styled to the portfolio signature)
  - visual-showcase → asymmetric editorial cells (if services grid) — match mockup
- **`AboutSection.tsx`** — per-signature story layout (split, quote band, image+framing per mockup; e.g. Redline "The Standard" ink band, Erin/Atelier portrait + statement, Meridian sanctuary split, medical "Why choose us" feature rows).
- **`TestimonialsSection.tsx`** — per-signature testimonial cards (meridian cream-light + gold stars, medical gradient rounded cards + initials, studio centered quote, redline mono attribution).
- **`CtaSection` / `CtaBand`** — per-signature cta band (signal solid, amber, gold, teal, ink-with-hairline, coal…) per mockups.
- **`ContactSection.tsx`** — per-signature contact layout (keep localized `site.labels.*`; frame per mockup where it has a contact treatment).
- Coordinate through `atoms.tsx` primitives (SectionHead, SiteCard, CtaBand, StatBlock) — extend use where signatures require (they already exist and are theme-aware).

## Technical details
- Read `01-design-audit/newmodern-design-source.md` fully. Read `07/MILESTONE.md`. Read existing `ServicesSection/AboutSection/TestimonialsSection/CtaSection/ContactSection` and `atoms.tsx` — preserve field keys, `svcCount`, content contract (`F`/`SlotImage`/`SampleTag`), and `SectionRenderProps`.
- Do not hardcode demo text; content flows through `F(content, "service_1_title", …)`. Demo copy is task 05.
- RTL/logical props; Arabic stays on Arabic stacks via existing `:lang(ar)` overrides; no directional utilities.
- KISS: reuse primitives; avoid copy-paste; branch on the ten `signature` values with small focused variants.

## Dependencies
- Tasks `07/01` + `07/02` done/verified. `newmodern-design-source.md`. CODE_RULES.md.

## Out of scope
- Header/Hero/Footer (02). Menu/gallery/faq/hours/pricing/team (04). Demo copy (05). `preview.svg` (06). Provider/engine changes.

## Acceptance criteria
1. lint + tsc + build green; `/api/health` ok after restart.
2. `/preview/classic-services` services section shows numbered dotted-leader/ticket rows; `/preview/professional-profile` shows ledger entries with brass rule; `/preview/simple-shop` shows specimen cards; `/preview/bistro-menu` shows elegant dotted-leader menu with flared price — verify in built HTML.
3. Each template's cta band + contact frame uses that template's accent/hairline per mockup; localized labels still render (EN/AR).
4. Edit-mode affordances preserved (F/SlotImage/SampleTag still present); no hardcoded strings introduced.
5. No directional utilities; AR preview for ≥3 representative templates renders sections readably in Arabic.

## Definition of Done
- CODE_RULES; clean suite under build rule; the five acceptance criteria verified in built HTML for a majority of templates at scale (spot ≥6 templates across families); no regressions to defaults.