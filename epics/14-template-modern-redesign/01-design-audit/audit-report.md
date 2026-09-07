# Epic 14 — Template Design Audit & Design-Language Plan

**Status:** Binding design source for Milestones 02–06.
**Author:** Epic-14 execution (prompt/sixteen.md), document-only milestone.
**Date:** 2026-09-07.

---

## 1. Method

### What was read (repo, in full)
- `CODE_RULES.md` (binding rules — RTL/logical utilities, i18n, no deps).
- `epics/14-template-modern-redesign/EPIC.md` + all milestone/task files (this report implements the binding theme-assignment table and the model in `02/MILESTONE.md`).
- `src/features/templates/types.ts` — `TemplateStyle { fontPair, radius, imagery }`, `TemplateDefinition.colors.defaultAccent`, `TemplatePage`, `TemplateSection`.
- `src/features/templates/catalog.ts` — all 10 template definitions, section builders, per-template `style` + `defaultAccent`.
- `src/shared/site-render/{SiteRenderer,context,tokens,internals}.ts(x)` — provider nesting, `SiteStyleContext`, token mapping, `F`/`SlotImage`/`SampleTag`.
- `src/shared/site-render/sections/*.tsx` (all 14 components) — read line-by-line and assessed against the template catalog.
- `src/features/templates/lib/demoContent.ts` — bilingual demo copy (currently one-size-fits-all).
- `src/shared/ui/fonts.ts` + `src/app/globals.css` — display/serif/sans/Arabic faces and the semantic + `mono-*` token sets.
- `src/features/sites/types.ts` — `SiteBusinessInfo`, `ContentField`, `SiteImage`.
- Preview surface: `src/app/preview/[templateId]/[[...slug]]/page.tsx` + `src/features/template-preview/components/TemplatePreviewShell.tsx` (passes `images={}` → renders `real/**` webps).
- Public assets inventory: `public/templates/real/<category>/*.webp` (services, restaurant, retail, professional, portfolio) — reuse only; no new image files.

### What was researched (external, 2026)
- **Awwwards** — "Understanding Web UI Visual Hierarchy" (Z-pattern, contrast, scale, whitespace as the load-bearing tool; one action per screen).
- **Webflow** — "7 visual hierarchy principles" (size/scale, whitespace/negative space, repetition, rule of thirds, one CTA).
- **Webflow / founder-premium deep-dive** — whitespace is the single highest-leverage premium signal (Section padding ≥80–128px desktop, consistent 4/8 spacing scale, CTA breathing room 24–48px, hero→next-section gap 96–128px).
- **Webflow Developers, "Landing Page Design Psychology"** — 60/30/10 color restraint, one display + one body family max, 12–80px type range, bento grids, dark-as-primary, purposeful motion.
- **Viralistic, "Premium Web Design 2026"** — restraint/remove-until-it-matters, type carries the perceived value, line length 65–75ch, leading 1.5–1.7, motion responds not performs.
- **Hero-pattern roundups (Brainy.ink, Spell.sh, UI Drop, 21st.dev, shadcn)** — split-screen (text-left/proof-right, message-first stacking on mobile), full-bleed visual with overlay, big-typographic-statement; hero needs exactly 3 text levels (H1/sub/CTA); negative letter-spacing on large headings; `min-height` not `height`, message-first order.

I deliberately extracted *principles* (whitespace scale, typographic scale, split/bleed/typo hero patterns, card treatment, accent restraint, section rhythm) and did not copy any single site's composition.

---

## 2. Principles — why modern professional sites look professional

1. **Generous, consistent whitespace is the highest-leverage premium signal.** Premium sites (Apple, Stripe, Linear) use dramatic hero padding (96–128px), 96–128px section gaps, 24–48px card gaps and CTA breathing room, on a consistent 4/8 scale. *Justification:* Material/NNG research shows generous whitespace raises trust scores and comprehension; tight/dense layouts read as amateur. → M02+ sets a `py-20/24` section rhythm and container padding.
2. **A real typographic scale with strong hierarchy, not default weights.** One display face + one body face; a modular scale (headings ~2–4rem, body 16–18px, leading 1.6–1.8); deliberate weights (700+ headings / 400 body); negative letter-spacing (`tracking-tight`) on display sizes. *Justification:* "Type carries the perceived value" (Viralistic); Smashing/Webflow both cite typographic hierarchy as the top perceived-quality driver. → site headings use the app display faces with `tracking-tight`, not Tailwind defaults.
3. **Three text levels in a hero, max, + one CTA.** Headline / subheadline / CTA label only; one primary action per screen. *Justification:* decision-matrix pattern research (Brainy.ink); more elements dilute conversion and read as busy/cheap. → heroes carry headline, subline, one CTA (no clutter).
4. **Section rhythm = alternating visual weight, not repeated identical blocks.** Content sections vary in background tone, column layout, and alignment so the page has a beat; every section does not "look the same." *Justification:* visual hierarchy research — repetition groups, but all-identical sections flatten rhythm. → families get composed flows (bento, numbered list, split, alternation).
5. **CTA hierarchy is deliberate and accent-driven.** A single accent is used sparingly (60/30/10): primary CTA is the accent (or a high-contrast ink fill), secondary elements are muted. *Justification:* color-restraint research; two competing buttons dilute the action. → `accentRole: fill|edge` encodes this as data.
6. **Imagery is a frame, not wallpaper.** Real photography cropped/positioned deliberately, in a considered frame (radius, shadow, slight offset), never a stretched stock wallpaper that ignores the text. *Justification:* real-photo-over-stock + framed-split-hero research; product-first hero patterns. → hero carries `hero_image` in a designed frame (or as bleed with overlay), reusing `real/**` webps.
7. **Borders/shadows are quiet and consistent.** Hairlines and subtle layered shadows, consistent radius per family, used to group (cards) not decorate. *Justification:* component-consistency research — identical radii/shadows signal professionalism. → `SiteCard` family shares radius/shadow token logic.
8. **States are present but restrained (hover/lift, active, focus ring), respecting reduced motion.** Motion responds (~50–200ms, natural easing) rather than performs; `:focus-visible` ring visible. *Justification:* restraint + accessibility (WCAG AA); faded-in-wait heroes read amateur. → cards lift on hover, links underline, focus ring uses the mono token; `prefers-reduced-motion` already respected in globals.css.

---

## 3. Per-Template Audit (×10)

Common baseline problems across all 10 (details per template below):
- **Visual:** single skeleton — brand accent bar `h-1 w-12 rounded-full` + centered `text-3xl font-bold` + uniform card grid, on every content section. Headings render in Tailwind default `font-serif`/`font-sans` (ignoring the app display faces and the `:lang(ar)` swap). Spacing cramped (`py-16`, tight card padding). No section rhythm (every section is "bar + centered title + grid").
- **Structural:** no distinct hero per template; `imagery` gives only 2 heroes (photo bleed vs plain 2-col). No page-intro variant for internal pages. About = a single centered paragraph. Footer = one centered line. Contact hardcodes non-localized "Tel/Email/Address".
- **Content/repetition:** all 10 share the same demo business ("Demo Business") and the same service/testimonial/FAQ copy — previews feel like the same site re-painted.
- **Typography:** site headings don't use `--font-serif2`/`--font-display`; Arabic heading-family swap is overridden by Tailwind `font-*` utilities on section headings.
- **Responsive:** split heroes stack but without deliberate mobile order/type scale-down; grids rely on `@3xl` container queries (fine) but no narrow-width type/spacing scale-down.
- **RTL:** layout utilities are mostly logical already, but a few places need the reversal rule (arrows flips, asymmetric hero order) enforced uniformly.

### 3.1 classic-services
- **Type:** corporate services · accent `#1E40AF` (blue) · soft radius · photo imagery.
- **Current problems:** blue accent bar + centered serif heading + 3 same-shaped cards; hero is a plain 2-col split with tiny accent bar; "trustworthy/clean" promise is not expressed in the layout; generic demo copy.
- **Missing sections / weak:** no stats/social proof; no page intro on internal pages; about is a wall of text.
- **Must keep:** soft radius, calm structure, blue as trust accent.
- **Redesign direction:** corporate `split-light` hero (light surface, serif headings, `accentRole: fill`): editorial headline with a filled blue CTA and a framed `hero_image` (layered card + stat chip). Home services as a numbered editorial list (`SiteCard.feature` with order number + hairline). Add a `StatBlock` trust strip and a calm CTA band (brand fill). About page = editorial columns + values; Services page = overview + numbered service blocks + process.
- **Family verdict:** the "default trust" reference of the corporate family.

### 3.2 professional-profile
- **Type:** corporate · accent `#1F2937` (ink/graphite) · soft radius · minimal imagery.
- **Current problems:** residential/personal brand reads flat; minimal imagery means hero image is weak; centered-skeleton everywhere; generic copy copies the same demo text as services firms.
- **Must keep:** soft radius, ink-graphite trust, personal scale.
- **Redesign direction:** corporate `split-light` but `accentRole: edge` (no brand fill — understated hairline/underline accents fit a personal profile). Hero: editorial serif headline + portrait `hero_image` in a thin-frame treatment, CTA as a quiet ink-underline link. Home = intro + stats (years/engagements) + services as `SiteCard.feature` with edge accents + calm testimonial + edge CTA band. Distinct from classic-services by **accent role (edge vs fill)** and a more understated type/CTA — same corporate system, different weighting.

### 3.3 modern-studio
- **Type:** bold · accent `#0F172A` (near-black) · sharp radius · photo imagery.
- **Current problems:** deep, image-forward "creative studio" identity wasted; sharp radius + photo renders as a plain generic grid; no dark-surface confidence; hero image competes with text.
- **Must keep:** sharp radius, bold image-forward feel, near-black accent.
- **Redesign direction:** bold family — **deep surface** (`surface: deep`), sans headings, `split-deep` hero (`accentRole: edge`): asymmetric oversized display type on near-black with accent hairline/underline, hero image as a supporting framed block. Home = big-type intro, offset bold `SiteCard.feature` cards with edge accents, team strip, dark CTA band (bordered ink over deep). Sharp corners throughout.
- **Family verdict:** the flagship of the bold/deep family.

### 3.4 consultant-page
- **Type:** bold · accent `#4338CA` (indigo) · sharp radius · minimal imagery.
- **Current problems:** same bold/problem as modern-studio but with a strategy/finance persona; minimal imagery makes the bold family's "image-forward" blank; generic copy.
- **Must keep:** sharp radius, decisive indigo accent, professional/strategy weight.
- **Redesign direction:** bold `split-deep`, but `accentRole: fill` — indigo is used as a **filled** accent (brand chip, filled CTA, filled stat chips) to convey an outcome/finance energy distinct from modern-studio's edge-restraint. Hero: dark asymmetric, filled indigo CTA. Home = process-oriented numbered services (fill chips), stats, filled CTA band. Different accent role (fill vs edge) separates the two bold templates within a shared dark system.

### 3.5 warm-kitchen
- **Type:** warm · accent `#B45309` (amber) · soft radius · photo imagery.
- **Current problems:** inviting "homey restaurant" identity flattened into the generic skeleton; photo-bleed hero is a plain gradient; no menu warmth; generic copy.
- **Must keep:** soft rounded radius, amber warmth, generous feel.
- **Redesign direction:** warm family — light surface, serif headings, `photo-bleed` hero (`accentRole: fill`): full-bleed hero.webp with a soft gradient, large warm serif headline + amber CTA. Home = warmth intro + services as soft rounded `SiteCard.feature` + testimonial + amber-filled CTA band. Distinct from bistro via **photo-bleed + fill** and a homey/comfortable voice versus bistro's crisp edge menu.

### 3.6 bistro-menu
- **Type:** warm · accent `#7C2D12` (barn-red) · sharp radius · minimal imagery.
- **Current problems:** sharp radius + minimal imagery reads cold for a bistro; menu is a plain dashed-leader list; accent bar skeleton.
- **Must keep:** sharp/refined edge, ingredient-forward refinement.
- **Redesign direction:** warm `split-light` (`accentRole: edge`): editorial serif hero with framed hero image (thin radius, no soft fill) + barn-red accent as edge hairlines/leaders. Menu = refined dotted-leader bilingual rows with flared prices; reviewers see an elegant, crisp bistro distinct from warm-kitchen's soft bleed. **Family pairing:** warm-kitchen (soft/fill/bleed) vs bistro (sharp/edge/split-light) — same warm palette algorithm, different materials.

### 3.7 simple-shop
- **Type:** retail · accent `#15803D` (green) · soft radius · photo imagery.
- **Current problems:** product-first "small retail shop" promise lost; gallery-style grid reads as arbitrary; no clear offer hierarchy; generic copy.
- **Must keep:** soft radius, friendly green, accessible retail register.
- **Redesign direction:** retail family — light surface, sans headings, `split-light` hero (`accentRole: fill`): approachable split with green-filled CTA + framed product hero image. Home = product-led `SiteCard.feature` (imagery emphasis) + gallery of products + FAQ + affordable pricing + green-filled CTA band. Retail system: product-led cards, sans type, friendly.

### 3.8 product-focus
- **Type:** retail · accent `#0E7490` (cyan) · sharp radius · minimal imagery.
- **Current problems:** "single product front-and-center" requires a product-shot hero; minimal imagery + sharp gives a bare grid; no spec-aware story.
- **Must keep:** sharp radius, cyan tech-cool accent, minimalist product focus.
- **Redesign direction:** retail family with `photo-bleed` hero (`accentRole: edge`): full-bleed product hero.webp with cyan accent used as edge/hairline + a single focused CTA; the product "is the proof." Home = spec-led feature cards with cyan edge accents, testimonial, pricing tiers, gallery of the product. Distinct from simple-shop via **hero (bleed vs split) + accent role (edge vs fill)** — retail system, different emphasis (single hero product vs multi-product shop).

### 3.9 clean-portfolio
- **Type:** creative · accent `#7C3AED` (violet) · sharp radius · photo imagery.
- **Current problems:** minimalist "freelance portfolio" flattened to a generic grid; no showcase/editorial feel; violet accent underused; generic copy.
- **Must keep:** sharp radius, minimal clean gallery, work-first.
- **Redesign direction:** creative family — light surface, sans headings, `split-light` hero (`accentRole: edge`): clean editorial hero with framed project image + violet edge accents. Home = curated/bento project grid (`SiteCard.project`), testimonial strip, team (creator), edge CTA band. Creative system: asymmetric bento grids, sans display, editorially clean.

### 3.10 visual-showcase
- **Type:** creative · accent `#DB2777` (pink) · soft radius · photo imagery.
- **Current problems:** "visual-forward artist/designer" promise needs a dark gallery mood; soft radius + photo with no showcase treatment; generic copy.
- **Must keep:** soft radius, visual-forward, bold accent energy.
- **Redesign direction:** creative family but **deep surface + `photo-bleed` + `accentRole: fill`** — distinct from clean-portfolio's light/edge/split. Hero: full-bleed showpiece webp over deep surface with pink fill accent + display type. Home = asymmetric bento gallery + strong testimonial + pink-filled CTA band. **Family pairing:** clean-portfolio (light/edge/split) vs visual-showcase (deep/fill/bleed) — same creative bento system, opposite surface.

---

## 4. Design System Plan

### 4.1 Theme model (binding, from MILESTONE.md)
```ts
TemplateTheme { key: "corporate"|"bold"|"warm"|"retail"|"creative";
                surface: "light"|"deep";
                headingFont: "serif"|"sans";
                hero: "photo-bleed"|"split-light"|"split-deep";
                accentRole: "fill"|"edge"; }
```
`TemplateStyle` gains required `theme: TemplateTheme`. `SiteStyleContext` widens to full `TemplateStyle`.

### 4.2 Reusable primitives (built in M02, `src/shared/site-render/atoms.tsx`)
- **`SectionHead`** — section title block, `centered` | `start` variant; `accentRole: edge` → thin brand hairline/bar/underline; `fill` → brand eyebrow chip/tag; renders headline via `F` with `.site-heading-*`. Replaces the `h-1 w-12 rounded-full` bar uniformly.
- **`CtaBand`** — accent-aware band: `accentRole: fill` → brand background + light text; `edge` → ink/deep surface with accent hairline + framed CTA. Honors `onNavigatePage`/`pageBaseHref` to contact.
- **`SiteCard`** — shared card family (radius via `RADIUS_CLASSES`, shadow, padding scale; hover lift). Sub-styles: `feature` (services), `testimonial`, `project`, `stat`, `plan`.
- **`StatBlock`** — number/label stat treatment (used in hero/social-proof).
- All render `F`/`SlotImage`/`SampleTag` so edit-mode affordances survive by construction.

### 4.3 Typographic scale (applied per role in section markup)
| Role | Class combo | Size/weight (approximate) |
|---|---|---|
| Hero | `.site-heading-*` (self or sans) | `text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]` |
| Section | `.site-heading-*` | `text-3xl font-bold tracking-tight` |
| Sub (eyebrow/label) | `.site-body` + tracking | `text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground` |
| Body | `.site-body` | `text-base sm:text-lg leading-relaxed text-muted-foreground` |
| Footer/labels | `.site-body` | `text-sm` |

`..site-heading-serif` → `var(--font-serif2)`; `.site-heading-sans` → `var(--font-body)`; `.site-body` → `var(--font-body)`; Arabic overrides route all headings to `--font-ar-serif` and body to `--font-ar-sans`.

### 4.4 Whitespace / rhythm system
- Section padding: `py-20` desktop (`py-16`→`py-20`), hero `min-h-[66vh]` + generous padding, internal pages page-intro `py-20`.
- Container: `max-w-6xl mx-auto px-4` (content) and `max-w-7xl` for wide galleries/heroes; paragraph `max-w-xl/2xl` for measured line length.
- Gaps: cards `gap-6`, grids `gap-8`, section head→content `mb-10/12`, hero subline→CTA `mt-8`.
- Sequence rhythm: alternate light/muted/deep bands; never all-identical-height blocks.

### 4.5 Deep surface palette (`.site-surface-deep`, chosen in audit)
A near-black warm palette so `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-input` adapt automatically:
- `--background: #0f1115`
- `--card: #171a20`
- `--muted: #1e2229`
- `--muted-foreground: #9aa1ac`
- `--foreground: #f2f3f5`
- `--input: #2a2f38`
- `--border: #2a2f38`
- `--ring: var(--brand)`

### 4.6 Engine limitation documented (from code reading)
`SectionRenderProps` = `{ section, content, businessInfo, images }` — there is **no page/context variant prop**. Sections like `AboutSection`/`ServicesSection` render the same component whether on home or their internal page (in this catalog each section type maps to exactly one page, so this is not currently a functional blocker). If future templates need the *same* section type styled differently per page, the engine would need a small additive prop — **not needed for this epic**; M03/M04 key family variation off `useSiteStyle().theme` + section-agnostic data as the tasks require. No blocking engine limitation found.

---

## 5. Theme Assignments (binding — matches the reference table exactly)

The binding assignment table IS the table in the task file; restated here with one-line justification + per-family design decisions.

| template | key | surface | headingFont | hero | accentRole |
|---|---|---|---|---|---|
| classic-services | corporate | light | serif | split-light | fill |
| professional-profile | corporate | light | serif | split-light | edge |
| modern-studio | bold | deep | sans | split-deep | edge |
| consultant-page | bold | deep | sans | split-deep | fill |
| warm-kitchen | warm | light | serif | photo-bleed | fill |
| bistro-menu | warm | light | serif | split-light | edge |
| simple-shop | retail | light | sans | split-light | fill |
| product-focus | retail | light | sans | photo-bleed | edge |
| clean-portfolio | creative | light | sans | split-light | edge |
| visual-showcase | creative | deep | sans | photo-bleed | fill |

### Design decisions per family
- **corporate** (classic-services, professional-profile): light surfaces, serif display headings, split-light editorial heroes, filled CTA for the trust firm vs edge/quiet CTA for the personal profile. Signature: editorial split hero with framed image + stat chip; numbered service rows.
- **bold** (modern-studio, consultant-page): deep surfaces, sans display, asymmetric split-deep heroes with oversized type. Signature: dark surface + accent hairline (edge, modern-studio) or filled brand chip/CTA (fill, consultant-page) → offset bold cards on deep.
- **warm** (warm-kitchen, bistro-menu): light surfaces, serif headings. warm-kitchen = photo-bleed + fill (soft rounded, amber CTA); bistro-menu = split-light + edge (sharp, barn-red hairlines/dotted leader menu). Signature: full-bleed comfort hero vs refined dotted-leader menu.
- **retail** (simple-shop, product-focus): light surfaces, sans headings. simple-shop = split-light + fill (green product cards); product-focus = photo-bleed + edge (single product hero, cyan hairlines). Signature: product-led cards; one template multi-product, one single-shot.
- **creative** (clean-portfolio, visual-showcase): bento/asymmetric grids. clean-portfolio = light + split-light + edge (minimal editorial); visual-showcase = deep + photo-bleed + fill (dark gallery). Signature: bento project grid; opposite surface to vary mood.

### Hero + homepage ASCII wireframes per family

**corporate (light / serif / split-light / fill|edge)**
```
[HEADER: logo | nav..................]
[SPLIT HERO:  (light)                          ]
[  text col        |  image col (framed)       ]
[  eyebrow         |  ┌────────────┐           ]
[  h1 (serif)      |  │ hero.webp  │  offset   ]
[  subline         |  │            │────────── ]
[  [CTA fill]      |  └────────────┘  stat chip]
[  ----------------|-------------------------- ]
[MD: eyebrow chip | h2 (centered or start)     ]
[  numbered list: 01 Title / desc .... 02 ...  ]
[STAT strip: 3 stat blocks (fill)              ]
[CTABAND (fill): headline + [CTA]              ]  *or* edge variant on professional-profile
```
Internal: About = intro hero (light) + editorial 2-col story + values/stats; Services = overview + numbered service rows + process.
```
**bold (deep / sans / split-deep / edge|fill)**
[HEADER: logo (light text on deep)   nav.......]
[SPLIT-DEEP HERO (near-black)                  ]
[  ┌───────────────────────────┬──────────────┐]
[  │ h1 oversized (sans)       │ framed image │]
[  │ subline                   │ (supporting,  │]
[  │ [accent CTA]   hairline   │  not focus)  │]
[  │ (fill→filled chip/CTA ──) │              │]
[  └───────────────────────────┴──────────────┘]
[MD: eyebrow | h2 | offset bold cards (edge)  ]
[  ┌─┐ ┌─┐ ┌─┐  ... with top/side accent line ]
[STAT strip (edge or fill chips)               ]
[CTABAND (deep + accent)                       ]
```
Internal: About = dark intro + oversized pull-quote values; Services = overview + bold service blocks.
```
**warm (light / serif / photo-bleed|split-light / fill|edge)**
[HEADER .... nav......]
[PHOTO-BLEED HERO (hero.webp full-bleed)       ]
[   gradient overlay, bottom/start aligned     ]
[   h1 (serif, large)                          ]
[   subline                                    ]
[   [amber CTA fill]                           ]
[MD: eyebrow chip | h2 | soft rounded feature   ]
[   cards (generous)                           ]
[testimonial card (warm)                       ]
[CTABAND (amber fill)                          ]   *bistro: split-light + edge foremost on menu
```
Internal: About = story w/ imagery; Services = warm feature cards; Menu = refined dotted-leader bilingual rows.
```
**retail (light / sans / split-light|photo-bleed / fill|edge)**
[HEADER ... nav......]
[SPLIT HERO (simple-shop, fill):               ]
[  text col | product image col (framed,green) ]
[  [green CTA fill]                            ]
[   OR PHOTO-BLEED (product-focus, edge):      ]
[   full-bleed product hero + cyan hairline    ]
[MD: h2 | product-led cards (imagery)          ]
[gallery of products (grid/bento)              ]
[testimonial (product-focus) | FAQ (simple-shop)]
[pricing tiers (featured tier)                 ]
[CTABAND (fill or edge)                        ]
```
Internal: About = approachable split + stats; Services = product-feature cards; Gallery = product grid.
```
**creative (light|deep / sans / split-light|photo-bleed / edge|fill)**
[HEADER ... nav......]
[SPLIT-LIGHT HERO (clean-portfolio, edge):     ]
[  editorial col | framed project image        ]
[   [violet edge CTA]                          ]
[   OR PHOTO-BLEED (visual-showcase, deep/fill):]
[   full-bleed showpiece + pink fill CTA over deep]
[MD: h2 | BENTo project grid (asymmetric)      ]
[     ┌───┐ ┌─────────┐  (varied cell sizes)   ]
[     └───┘ └─────────┘                       ]
[testimonial strip (creator)                   ]
[team (creator profile)                        ]
[CTABAND (edge or fill)                        ]
```
Internal: About = asymmetric reveal; Services = bento service cells; Gallery = curated bento grid.

### Documented engine limitations
None blocking. The only notable constraint: sections share one component per type and can't receive a page-role prop — not an issue for this catalog (each type maps to one page). Noted for future template workloads, no action in this epic.

---

*End of audit report. This is the binding design source for M02–M06; later milestones implement the decisions above and only deviate after documenting a genuine technical constraint.*
