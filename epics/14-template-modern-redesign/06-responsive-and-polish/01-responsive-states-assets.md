# Task — Responsive Validation, States & Preview Assets

## Title
Validate and fix responsive behavior and interaction states across all 10 templates; refresh the `preview.svg` card thumbnails.

## Context
A professional template must hold together on a phone and in RTL, and feel alive on hover/focus. The container-query system gives us strong desktop behavior; this task verifies tablet/mobile, enforces polish (spacing, type scale at small widths, state treatments), and refreshes the marketing thumbnails so the library's packaging matches its new design language.

## Scope
- Responsive pass over every redesigned section: hero variants (split→stack order + correct RTL order), grids (`@3xl:grid-cols-*`), section heads (centered→start alignment at small widths where the audit calls), cards (padding/type scale), tables (pricing/hours/menu at narrow widths), gallery bento collapse. Use container-query breakpoints consistent with the engine convention.
- Overflow check: no horizontal scroll at ≤390px emulation — both locales. No fixed widths in sections (`max-w-*` must be `mx-auto` handled), no `w-[NNNpx]` in layout-critical code.
- Interaction states audit: hover (cards lift/underline), active, `:focus-visible` ring on interactive elements (nav links, CTA, accordion-look FAQ if added), respecting `prefers-reduced-motion`.
- Refresh the 10 `public/templates/<id>/preview.svg` files to visually match each template's family (see MILESTONE shared context). Verify they render in the dashboard/editor cards (they are the current fallback since screenshot.png doesn't exist) — filename/type unchanged.

## Technical details
- Verification without a real browser is a limitation: validate via (a) built pre-rendered HTML structure at narrow widths (class presence/ordering), (b) grep-based overflow audits (no width utilities in new markup), (c) the container-query classes used, and record exactly what was code-verified vs. what needs a human browser check (return report "needs a human eye" list).
- If a mobile menu already exists (M03 header), confirm it is usable (aria-expanded, logical positioning).
- Keep every section's data + edit-mode contracts intact.

## Dependencies
- M04 completed; primitives + hero live. Audit responsive notes. CODE_RULES.md.

## Out of scope
- Catalog/content changes. Adding browser test tooling or new dependencies. Generating real screenshots.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass (build rule); `/api/health` ok.
2. No layout-critical fixed widths or directional utilities in the sections/atoms/chrome touched by the epic (grep-verified).
3. `preview.svg` for all 10 templates updated and served (200) at `/templates/<id>/preview.svg`.
4. Hero split variants show stacked order and correct RTL ordering in the built HTML classes for a sample dark + light template.
5. `:focus-visible` and hover classes present on nav/CTA/card interactive elements (spot-checked).
6. Return report lists "code-verified" vs "needs human browser check" explicitly for responsive.

## Definition of Done
- Verification green; overflow/state checks documented; thumbnails updated and reachable.