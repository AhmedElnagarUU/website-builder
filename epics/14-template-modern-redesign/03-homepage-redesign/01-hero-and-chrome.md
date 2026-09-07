# Task — Hero Variants

## Title
Implement the three hero variants (`photo-bleed`, `split-light`, `split-deep`) behind `theme.hero`, plus header/logo/mobile-nav polish.

## Context
The hero is the thesis of every template — the single element that says "this is a real professional site." Today `HeroSection` has exactly two looks keyed on `imagery` (full-bleed photo gradient vs two-column with accent bar). Milestone 03's job is to make the hero feel deliberately designed per family while the engine stays untouched.

## Scope
- `src/shared/site-render/sections/HeroSection.tsx`: re-implement as a theme-aware component that switches on `useSiteStyle().theme.hero`:
  - **`photo-bleed`** — refined full-bleed image hero: overlay gradient, generous top/bottom padding, headline + subline + a primary CTA (link to `services`/contact via `useSiteNav`) using the theme's accent role. Strong type scale from the audit.
  - **`split-light`** — two-column on light surface: editorial headline + subline + CTA on one side (serif or sans per `theme.headingFont`), framed `hero_image` on the other with a deliberate frame treatment (rotated off-frames, stat chip, or layered card per audit), generous whitespace.
  - **`split-deep`** — dark-surface asymmetric hero: oversized display type, contrast-driven, accent used as `edge` (hairline/underline) or `fill` (brand chip/button) per theme; image treated as a supporting block, not the focus.
- Reuse `F` for headline/subline (edit mode intact) and `SlotImage` for `hero_image`. CTA must respect `onNavigatePage` (edit mode) vs real `pageBaseHref` links (view mode) exactly like `CtaSection` does today.
- Header polish (same file keeps nav behavior): tie nav link/active styles and the mobile menu to `.site-heading-sans`/theme, theme-aware active indicator echoing `accentRole`, hover states. No changes to `useSiteNav` API or edit-mode nav wiring.
- Add any new user-facing string (e.g. a hero CTA label default) to both message files with translations — prefer reusing existing key/values where the audit allows.

## Technical details
- Preserve the `min-h-[66vh]` → refined scale; hero must not feel cramped: audit spacing rhythm applies (e.g. `py-16..24`, `max-w-*` per family).
- Responsive: split layouts stack gracefully on mobile (image below text, correct order in RTL using logical start), no horizontal overflow.
- `token`-wise: use `RADIUS_CLASSES`/`CARD_SHADOW` where the frame needs them; keep `theme` values as the only data source for branching.
- Verify each family on the preview surface and iterate until each hero reads as "designed": spot errors per family in the return report.

## Dependencies
- M02 primitives (`SectionHead`/`CtaBand` if used), style data model + tokens, audit report hero wireframes. CODE_RULES.md.

## Out of scope
- Homepage mid-page sections (next task). Internal pages (M04). Content copy (M05). `preview.svg`. New images/dependencies.

## Acceptance criteria
1. `lint` + `tsc --noEmit` + `npm run build` pass (build rule); `/api/health` ok.
2. All three hero variants render: spot check one template per variant (photo-bleed: `warm-kitchen`/`visual-showcase`/`product-focus`; split-light: `classic-services`/`bistro-menu`; split-deep: `modern-studio`) at `/preview/<id>` → 200 and hero headline/subline text present in HTML.
3. Deep-surface templates' hero HTML carries the dark surface classes and light text (checked in built HTML).
4. Every hero keeps `hero_headline`/`hero_subline`/`hero_image` fields wired (F/SlotImage) — no field is dropped.
5. Edit mode still renders hero fields as editable (code-level: F/SlotImage/SampleTag unchanged; document).
6. No directional utilities; no leftovers of the old single-skeleton hero pattern (`h-1 w-12 rounded-full` bar without theme branch).
7. Header nav + mobile menu: present on all pages, active page styled, hamburger toggles open/close (verified in dev smoke HTML/JS presence + state).

## Definition of Done
- Verification suite green every step; per-family hero review recorded in the return report with one "what still needs a human eye" note per hero.