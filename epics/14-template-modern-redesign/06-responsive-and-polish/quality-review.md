# Epic 14 — Final Template Quality Review (before → after)

**Status:** Epic-closing artifact. Companion to `01-design-audit/audit-report.md` (the binding design source).
**Evidence basis:** code reading + `npx tsc --noEmit` + `npm run lint` + clean `npm run build` (build rule) + `GET /api/health` (200) + runtime smoke of sample preview routes across the families (deep/light/warm + subpages, all 200) at the final state (homes ×10 and internal subpages also smoke-tested green in earlier milestones) + built-payload/text greps. "Deduced from code" vs "needs a human browser pass" is stated per item.

---

## 1. Verdicts per template (10/10)

Legend: **meets bar** = stands up as a professional site at code-verified level; **close** = professional but with a flagged visual follow-up.

### classic-services — corporate · light · serif · split-light · fill (#1E40AF) — **meets bar**
- 3 strongest changes: (1) numbered editorial service list — `01/02/03` serif numerals + hairline rows in `ServicesSection` (corporate branch) replacing the uniform card grid; (2) filled blue eyebrow chip + filled CTA + framed hero image with a blue stat chip (`SplitLightHero` + `SectionHead` fill path); (3) filled blue CTA band + "Trusted by 500+ clients" trust chip under the localized `site.labels.trusted_clients`.
- Remaining gaps: hero image is a shared `real/services` webp (not business-specific); needs a human visual pass on the framed treatment. Minimal next step: view `/preview/classic-services` in a browser and, if the crop feels generic, pick a tighter `defaultAsset`/position for the hero slot.

### professional-profile — corporate · light · serif · split-light · edge (#1F2937) — **close**
- 3 strongest changes: (1) understated edge treatment throughout (hairline eyebrow, outline CTA, hairline stat card) deliberately distinct from classic-services' fill; (2) personal-scale hero with framed portrait + engagement stats in the demo copy; (3) quiet outlined CTA band instead of a color flood.
- Remaining gaps: the `real/professional` webp may not read as a personal portrait of "Adel Karim"; needs a human pass. Minimal next step: browser-check `/preview/professional-profile`; if the portrait crop is unconvincing, consider an object-position tweak on the hero slot.

### modern-studio — bold · deep · sans · split-deep · edge (#0F172A) — **meets bar**
- 3 strongest changes: (1) near-black deep surface via `.site-surface-deep` (verified in rendered HTML); (2) asymmetric split-deep hero — oversized sans display (64rem container `@5xl`) with text-first/stacked mobile order (verified `@5xl:grid-cols-5` + text col first); (3) numbered hairline service blocks with edge accent bars on `bg-card`.
- Remaining gaps: deep surface + shared photos can mute images; needs a browser pass on image luminance. Minimal next step: human check; if muted, consider a subtle image treatment (the engine allows `objectPosition` only — acceptable).

### consultant-page — bold · deep · sans · split-deep · fill (#4338CA) — **meets bar**
- 3 strongest changes: (1) filled indigo chips/CTA on deep (the fill/edge pair to modern-studio delivers the strategy/finance energy the audit asked for); (2) outcome-driven numbered engagements with filled step chips; (3) indigo-filled CTA band.
- Remaining gaps: minimal imagery means the section rhythm must carry it — human browser pass on type scale at ≤390px. Minimal next step: browser-check; adjust container-level type only (no new breakpoints).

### warm-kitchen — warm · light · serif · photo-bleed · fill (#B45309) — **meets bar**
- 3 strongest changes: (1) full-bleed hero.webp with bottom gradient overlay + amber serif headline (PhotoBleedHero); (2) soft rounded feature cards and generous spacing (SiteCard soft radius); (3) amber-filled CTA band + rounded-2xl carousels of menu/hours.
- Remaining gaps: overlay contrast on light food photos; human browser pass. Minimal next step: check `/preview/warm-kitchen`; gradient is `from-black/80 via-black/40` — fine unless a specific photo is bright.

### bistro-menu — warm · light · serif · split-light · edge (#7C2D12) — **meets bar**
- 3 strongest changes: (1) refined dashed/bordered menu rows with brand-colored flared prices (`MenuSection`, edge variant); (2) sharp-radius framed hero + hairline edge accents; (3) quiet outlined CTA band.
- Remaining gaps: long menu names at narrow widths (mitigated by `min-w-0` + price `shrink-0` — code-verified). Minimal next step: human browser check of an 8-item menu at ≤390px.

### simple-shop — retail · light · sans · split-light · fill (#15803D) — **meets bar**
- 3 strongest changes: (1) green filled CTA + product-led cards with imagery emphasis; (2) pricing trio with a ringed "Most popular" plan (`PricingSection` featured badge, `ring-2`); (3) green-filled CTA band.
- Remaining gaps: 6 gallery slots share a single product category folder; visual variety depends on the shared webps. Minimal next step: human browser pass on the gallery grid.

### product-focus — retail · light · sans · photo-bleed · edge (#0E7490) — **meets bar**
- 3 strongest changes: (1) full-bleed product hero with cyan hairline accents + single focused CTA ("the product is the proof"); (2) spec-led edge cards with cyan left borders; (3) featured pricing tier within the retail sans system.
- Remaining gaps: hero reuse of the shared product webp; human browser pass on hero crop. Minimal next step: same as warm-kitchen (check crop, adjust position only).

### clean-portfolio — creative · light · sans · split-light · edge (#7C3AED) — **meets bar**
- 3 strongest changes: (1) bento project grid (wide/standard asymmetric cells, `@3xl:grid-cols-3`) replacing the uniform grid; (2) violet edge accents (hairline eyebrow + outline CTA); (3) "Available for" team trio localized in both locales.
- Remaining gaps: the bento's visual asymmetry is achieved by aspect-ratio crops, not true `row-span` heights — heights come from the imagery. Minimal next step: human browser pass on bento balance for a 6-image gallery.

### visual-showcase — creative · deep · sans · photo-bleed · fill (#DB2777) — **meets bar**
- 3 strongest changes: (1) deep surface + pink fill CTA over deep — the creative family's opposite-surface pairing to clean-portfolio; (2) full-bleed showpiece hero (verified `site-surface-deep` + `site-heading-sans` in rendered HTML); (3) bento gallery on deep with pink accent hairlines (fill used on chips/CTA only).
- Remaining gaps: gallery webp contrast on the deep surface — human browser pass. Minimal next step: check `/preview/visual-showcase`; if a photo is too dark, acceptable to leave (audit asked for "dark gallery mood").

---

## 2. Epic summary — acceptance criteria addressed item-by-item

| EPIC.md item | Evidence |
|---|---|
| Binding audit + design plan | `01-design-audit/audit-report.md` (5 sections; per-template plan + theme table) |
| Additive style-data (`TemplateTheme`) | `TemplateStyle.theme` required in `types.ts`; all 10 theme assignments in `catalog.ts` (grep: 10 `theme:` blocks) |
| Widened `SiteStyleContext` | `context.ts` exposes full `TemplateStyle`; all section consumers compile |
| Tokens + typography utilities | `tokens.ts` (`siteBodyClass/siteHeadingClass/siteSurfaceClass`, radius/shadow maps); `globals.css` `.site-heading-serif/.site-heading-sans/.site-body/.site-surface-deep` with `:lang(ar)` swaps |
| Section redesign (all sections) | 14 components rewritten in `src/shared/site-render/sections/*`; per-family composition via `style.theme.key` |
| Per-template bilingual copy | `demoContent.ts` — 10 templates × EN/AR, distinct business names verified in built payload (all 10 EN + all 10 AR strings compiled), no "Demo Business"/Lorem (grep), no Latin-in-AR leaks (fixed `professional-profile` faq), `pick()` arrays ≥ declared counts on every multi-field section |
| Responsive/overflow polish | container-query normalization (`GallerySection`, `TeamSection`, `PricingSection`: viewport `sm/lg` breakpoints replaced with `@2xl:@4xl:@3xl` container queries); hero stacked order verified (classic-services `@5xl:grid-cols-2`, modern-studio `@5xl:grid-cols-5`, text col first, image after); no layout-critical fixed widths (only `max-w-[180px]` avatar cap) or directional utilities in `site-render` (grep 0) |
| `preview.svg` refreshed | All 10 rewritten per family (surface/heading-font/hero/accent-role cues), served 200 at `/templates/<id>/preview.svg`, still XML-valid SVGs >1KB, same `400×500` (4:5) design |
| Interaction states | Global `a/button:focus-visible` mono ring in `globals.css`; hover states on nav links, CTA, `SiteCard` (`hover:shadow-lg`), footer links — spot-checked; `prefers-reduced-motion` global rule present |
| i18n (no hardcoded strings) | Fixed 3 hardcoded chrome strings this milestone → `site.labels.{contact, testimonials, trusted_clients}` (EN+AR); `ContactSection` Tel/Email/Address keys; `F`/`SlotImage`/`SampleTag` remain key-driven |

## 3. Product invariants — reconciled
- **No drag-and-drop/structural editor**: untouched (only section markup/classes changed).
- **Publish vs edit separate**: untouched (`EditorShell` still renders `SiteRenderer` with the same `RenderedSiteProps`; verified the call site + build).
- **Arabic first-class**: demo content fully AR-native with Arabic-Indic numerals + `$`; all chrome text message-keyed in both locales; RTL direction safe by logical-utility policy (grep 0 directional classes in `site-render`).
- **No new npm dependencies**: none added (CODE_RULES §4).
- **Engine seam honored**: only additive `TemplateStyle.theme` + widened context value; `F`, `SlotImage`, `SampleTag`, `SectionRenderProps`, `ContentField`, section→component mapping, provider nesting all unchanged.
- **Edit-mode affordances**: `F` empty-field hint, `SlotImage` tap-to-fill, `SampleTag` badge all render inside the redesigned sections by construction (they use the same primitives).

## 4. Deferred items — and why
1. **Real `screenshot.png` per template** — explicitly out of scope (EPIC.md "Out (future)"); `preview.svg` remains the card fallback and has been refreshed to carry the family cues.
2. **True variable-height bento (row-span)** — the creative galleries crop `aspect-[16/10]`/`aspect-[4/3]` cells to fake asymmetry instead of driving grid rows; visually acceptable, deliberately not engine-scoped. Next step if ever wanted: a content-driven row-span needs renderer support (out of epic scope).
3. **Live editor route runtime smoke** (`/en/sites/[siteId]/editor`) — requires an authenticated session with an owned site; verified structurally (identical `SiteRenderer` call site, `tsc`/build green), not runtime-sampled.
4. **≤390px RTL emulation in a real browser** — the code-level overflow checks pass (no fixed widths, flex wrap, `min-w-0` menu), but a true viewport emulation needs a browser; recorded as a human pass item below.

## 5. Needs a human browser pass (not code-verifiable here)
- Actual visual appeal/framing of the shared category webps inside each new hero treatment (esp. classic-services, product-focus, visual-showcase).
- Bento balance in the two 6-image creative galleries.
- Split-hero appearance in AR/`dir=rtl` at narrow widths (grid direction reversal is code-correct; visual confirmation pending).
- Long-name menu rows (bistro-menu) and 4-plan pricing (consultant-page) at ≤390px.
- Hover/focus feel on a real device (state classes present; tactile judgement is human).

## 6. Final verification evidence (M06-02 clean suite)
- `npx tsc --noEmit` — pass (0 errors).
- `npm run lint` — "No ESLint warnings or errors".
- Clean `npm run build` (dev stopped, `.next` deleted, plain build) — compiled in ~2.7min, 24 static pages OK, `/preview/[templateId]/[[...slug]]` SSG'd.
- `GET /api/health` → `200 {"status":"ok","db":true}`.
- Runtime smoke (final state): sample families verified at 200 — deep (visual-showcase), light (classic-services), warm (warm-kitchen) + subpages classic-services/services, modern-studio/about, bistro-menu/menu, simple-shop/pricing, professional-profile/faq, consultant-page/team, clean-portfolio/gallery.
- `preview.svg` ×10 → 200 (XML-valid `<svg>` roots).