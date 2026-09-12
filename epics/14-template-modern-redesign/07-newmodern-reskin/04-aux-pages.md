# Task — Aux Pages Reskin (menu / gallery / faq / hours / pricing / team)

## Title
Redesign the extra-page section components (Menu, Gallery, Faq, Hours, Pricing, Team) so each template expresses its newmodern signature patterns, matching the mockups' internal-page language.

## Context
Chrome (02) and homepage content sections (03) are done. These six section components serve the aux/data pages (menu, gallery, faq, hours, pricing, team). The newmodern mockups give each family a distinctive treatment of these (Redline dotted-leader index + ticket numbers, Ember menu preview dotted rows, Meridian room/experience cards + gold frames, Clearview rounded 12px cards + teal icon swap, Mara contact-sheet galleries with regs/plate numbers, Ledger-style filing cards with double-rules, Ironclad amber stat-border rows).

## Scope
- **`MenuSection.tsx`** — per-signature menu rows: dotted-leader `.dots` + flared price (Redline warm/Ember/bistro), mono categories + serif titles + flame/burgundy prices, gold-line separators, tabular mono amounts. Respect `itemCount` and `menu_item_*` keys; localized `site.days` unchanged elsewhere.
- **`GallerySection.tsx`** — per-signature gallery: contact-sheet grid with `.regs`/frame numbers + `gap-[2px]` (portfolio); bento/asymmetric editorial grid (visual-showcase, clean-portfolio); uniform refined grid with hairline borders (others). Keep `gallery_*` keys and `aspect` from slots; container-query responsive.
- **`FaqSection.tsx`** — per-signature accordion styling (native `<details>` preserved; hairlines vs cards vs ledger rows per mockup), `+`/rotate icons RTL-safe, `faq_*` keys.
- **`HoursSection.tsx`** — per-signature hours table (refined bordered rows, gold header line, mono labels), localized `site.days`.
- **`PricingSection.tsx`** — per-signature pricing (featured tier treatment per accentRole; gold/teal/amber highlights; framed edge vs filled band), `plan_*` keys, keep `labels.most_popular`.
- **`TeamSection.tsx`** — per-signature team grid (portrait cards, initials circles, mono roles, hover lifts), `team_*` keys.

## Technical details
- Read `01-design-audit/newmodern-design-source.md` fully. Read `07/MILESTONE.md`. Read existing `Menu/Gallery/Faq/Hours/Pricing/TeamSection` components — do not change field keys/counts/`itemCount`/`faqCount`/`planCount`/`memberCount`; preserve edit-mode affordances (`F`/`SlotImage`/`SampleTag`) and `SectionRenderProps`.
- The engine already service both the home page and internal pages via one component per section type — do not duplicate components per page; branch inside the component by `signature` + container query, matching the mockup where the mockup has such a page (e.g. Harlan `insights`, Meridian `rooms`, Mara `series`).
- RTL/logical props; Arabic stays on Arabic stacks; no directional utilities; don't hardcode strings.
- KISS — extend `atoms.tsx` primitives when shared patterns recur across signatures rather than inventing new files.

## Dependencies
- Tasks `07/01`+`07/02`+`07/03` done/verified. `newmodern-design-source.md`. CODE_RULES.md.

## Out of scope
- Homepage-only sections (03). Demo copy (05). `preview.svg` (06). Structural changes to providers/`F`/`SlotImage`.

## Acceptance criteria
1. lint + tsc + build green; `/api/health` ok after restart.
2. Spot checks in built HTML: `/preview/bistro-menu/menu` + `/preview/warm-kitchen/menu` render distinct dotted-leader rows with flared prices per signature; `/preview/clean-portfolio/gallery` hides a contact-sheet/regs grid; `/preview/product-focus/pricing` shows the teal featured tier treatment; `/preview/hotel`-mapped template (bistro-menu) gallery shows gold frames + aspect-square hover plus.
3. Fields intact: `menu_item_*`, `gallery_*` (slot `image` refs), `faq_*`, `hours_*`, `plan_*`, `team_*` render with `F` in the same DOM shape as before (edit mode hooks preserved).
4. Localized labels (`site.days`, `labels.most_popular`) still resolve in EN + AR; no directional utilities; AR pages readably render.
5. Container-query responsive (no broken grids at `@2xl`/`@3xl`/`@4xl`); no overflow regressions apparent from code.

## Definition of Done
- CODE_RULES; suite green under build rule; acceptance criteria verified in built HTML for the six components across ≥7 representative templates; no regressions to default/other templates.