# Task — Chrome Reskin: Header, Hero, Footer (newmodern)

## Title
Redesign the Header, Hero, and Footer section components so each template renders its own newmodern design signature (per `newmodern-design-source.md`), consuming the `design`/palette/font data from task 01.

## Context
After task 01, each template carries palette vars, fonts, and a `signature`. Header/Hero/Footer are the strongest brand moment — the mockups each treat them distinctly (Redline split hero + work-order ticket + ink marquee; Volatile text-stroke + neon; Ember & Oak charred typography + fire-readout; Meridian gold-lines + Cormorant light + parallax; Arbor & Clay specimen float; Clearview teal glow + float badge; Harlan typographic ledger hero; Ironclad dark overlay + amber stats; Mara contact-sheet strips + regs; Atelier asymmetric Playfair). This task executes those in the three chrome components.

## Scope
- **`src/shared/site-render/sections/HeroSection.tsx`**: keep the existing three variant shells (`PhotoBleedHero`, `SplitLightHero`, `SplitDeepHero` — engine contract) but branch per `design.signature` for composition/CtAs/typography/shadow treatments. Templates landing on the same shell differ via palette/fonts + signature-specific extras (stat chip, frame shadow, overlay, .fire-read strip, gold-line, specimen float, contact-sheet strip, stat chips).
- **`src/shared/site-render/sections/HeaderSection.tsx`**: per-signature logo/CTA treatment (signal pill "24/7", accent pill on dark, gold outline CTA, teal "Book Now", ledger "Begin a conversation", bordered mono "Contact", marquee-less variants), same nav + hamburger + `useSiteNav`/edit-mode behavior. Keep AR/mono/logical props.
- **`src/shared/site-render/sections/FooterSection.tsx`**: per-signature footer treatment (dark bands, mono headers, signal/brass/clay/red/teal hover accents, nav echo), consistent across pages by construction.
- **`src/shared/site-render/atoms.tsx`**: extend `CtaBand`/`SectionHead`/`SiteCard`/`StatBlock` where signatures need it (e.g. `accentRole` respects palette-signal vs brand fill; hard-offset shadows via task-01 helpers). Additive.

## Technical details
- Read `01-design-audit/newmodern-design-source.md` fully (chrome sections per template). Read `07/MILESTONE.md`.
- Keep the `F`/`SlotImage`/`SampleTag` affordances intact (edit mode). `useSiteStyle().theme` still drives layout shells; `design.signature` drives the distinctive expression. Never hardcode demo text — demo copy is task 05; use content fields through `F`.
- RTL: logical utilities only; arrows flip `rtl:rotate-180`; Arabic never gets forced Latin-only families (the AR `:lang(ar)` overrides stay authoritative).
- No new dependencies; no new image files (presentation/crop/overlay only; `images` come through `SlotImage`).

## Dependencies
- Task `07/01-design-data-and-fonts.md` done + verified. `newmodern-design-source.md`. CODE_RULES.md.

## Out of scope
- Services/about/testimonials/cta/contact sections (03). Aux pages (menu/gallery/faq/hours/pricing/team) (04). Demo copy (05). `preview.svg` (06). Structural changes to `SiteRenderer`/providers/`F`/`SlotImage`.

## Acceptance criteria
1. lint + tsc + build green (build rule); `/api/health` ok after restart.
2. Per-template spot check: `/preview/classic-services` → split hero with ink-framed image + signal ticket/stat chip + dark marquee band; `/preview/modern-studio` → text-stroke headline on near-black + accent pill CTA; `/preview/clean-portfolio` → typographic hero + contact-sheet/regs strip; `/preview/bistro-menu` → gold-line hero + Cormorant light headline. Verify in built HTML.
3. Header renders identically across all pages of each template (chrome from home — spot check two pages).
4. Footer consistent; hover states use the design accent; bottom bars match mockup treatments.
5. Edit-mode affordances still present in `editMode` (code-verify `F`/`SlotImage`/`SampleTag` used unchanged in the redesigned components).
6. No directional (non-logical) utilities introduced; AR preview of at least two templates shows headings/body in Arabic stacks.

## Definition of Done
- CODE_RULES followed; suite green; spot checks above pass in built HTML for at least 5 templates (one per signature family representative) + AR check; no regression to non-reskinned default contexts.