# Newmodern Design Source — Binding Translation Spec (Epic 14 addendum)

**Status:** Binding. Supersedes the family-level visual directions in `audit-report.md` §3/§5 as the *visual source*. The `TemplateTheme` axis model (§4.1), whitespace system (§4.4), primitives (§4.2), and typography utilities (§4.3) remain the engine contract. This document is the source of truth for per-template palette, typography, and signature patterns.

**Verdict overrides (user-confirmed 2026-09-12):** the 10 `newmodern/` mockups are each template's design source, replacing the generic family look currently implemented.

## Binding 10→10 mapping

| template | newmodern source | brand |
|---|---|---|
| classic-services | `newmodern/websites-template/services` | Redline Service Co. |
| modern-studio | `newmodern/websites/agency` | Volatile Studios |
| warm-kitchen | `newmodern/websites-template/restaurant` | Ember & Oak |
| bistro-menu | `newmodern/websites/hotel` | The Meridian |
| simple-shop | `newmodern/websites-template/retail` | Arbor & Clay |
| product-focus | `newmodern/websites/medical` | Clearview Dental |
| professional-profile | `newmodern/websites-template/professional` | Harlan & Co. |
| consultant-page | `newmodern/websites/construction` | Ironclad Builders |
| clean-portfolio | `newmodern/websites-template/portfolio` | Mara Ellsworth |
| visual-showcase | `newmodern/websites/architecture` | Atelier Voss |

---

# 1. classic-services ← websites-template/services (Redline Service Co.)

**Brand:** No-nonsense, blue-collar tradesmen; "The crew you call when it matters," same-day dispatch, licensed crews, honest estimates. Portland, OR. Est. 2011.

**Palette**
- Page bg: `#f1ebe1` (`--paper`); surface/ticket bg: `#fbf7ef`
- Text: `#17191b` (`--ink`); secondary `#55626e` (`--steel`)
- Accent: `#e4572e` (`--signal`); soft `#f2a183` (`--signal-soft`)
- Borders: `#d8d1c3` (`--line`); ink/15% row dividers
- Dark/CTA/footer: `#101214` (`--night`), `#17191b` (`--ink`)
- Focus: `#e4572e`

**Fonts (next/font)**
- Display: **Barlow Condensed** 500–700
- Body: **Barlow** 400–600
- Mono/labels: **IBM Plex Mono** 400–500
- Eyebrows/labels uppercased, tracking `0.18em–0.32em`

**Signature patterns**
- `.ticket`: `bg #fbf7ef; border 1px solid ink; box-shadow 6px 6px 0 0 ink` + signal badge (mono 10px, `letter-spacing .15em`, uppercase, `top:-10px right:18px`)
- `.perf`: `border-top: 2px dashed ink` + radial punch holes (`radial-gradient(circle, var(--paper) 4px, transparent 5px)`, `background-size 22px 12px`)
- `.dots` dotted leaders (2px dotted ink, opacity .35, `translateY(-4px)`)
- `.img-frame`: `border 1px solid ink; box-shadow 8px 8px 0 0 ink`
- Marquee band (condensed 11px uppercase tracking .25em)
- Work-order ticket card rows (mono Requested/Priority/Crew `#RL-2047` + `animate-pulse` signal dot)

**Header:** fixed h-16/lg:72px, transparent→scrolled; "RL" Barlow Condensed bold + signal ®; nav condensed medium `text-sm` uppercase tracking .18em; signal-filled "24/7" pill CTA.

**Hero:** split ~55/45, `pt-[72px] min-h-screen`. Left: mono eyebrow "Est. 2011 · Portland, OR"; H1 Barlow Condensed bold `clamp(2.8rem,7vw,5.4rem)` leading .92 ("when it matters." in signal); steel body; ink-filled "Request a Visit" + signal-outlined "24/7 Emergency" CTAs. Right: `.img-frame` full-height + overlaid `.ticket` work-order card (`animate-pulse` dot) + "Jobs running today 14".

**Section rhythm:** hero → ink marquee band → Service Manifest (`py-24/32`, signal mono eyebrow + condensed H2, dotted-leader index rows 01–06: mono signal numbers, condensed titles, `from $X` mono prices, `border-t border-ink/15`) → "The Standard" (bg-ink, Commitment 01/02/03 chips `border-signal/30`) → On the board (3-col `.img-frame aspect-[4/3]`, mono job-number + signal status, hover title signal, image scale 105%) → Stats band (`border-y border-ink/10`, 4-col signal condensed `text-5xl/6xl` counters + mono labels) → CTA band (`bg-signal text-white`).

**Footer:** bg-ink, 12-col: logo(5)/Navigate(2)/Trades(2)/Contact(3); mono headers paper/30 tracking .25em; hover signal; bottom bar `border-t border-paper/10`.

**Motion:** reveal (translateY 24px, 0.7s), count-up counters (IntersectionObserver + rAF 900ms), marquee 28s; reduced-motion off.

---

# 2. modern-studio ← websites/agency (Volatile Studios)

**Brand:** Bold, unapologetic, anti-safe; "We don't do safe. We do volatile." Los Angeles, est. 2018; 18 creatives, 120+ projects.

**Palette**
- Bg: `#0A0A0A`; surface `#141414`; lighter `#1A1A1A`
- Text `#F5F5F5`; secondary `#888888`
- Accent `#E8FF00` (hover `#CCFF00`)
- Borders `#2A2A2A`; work-card overlay gradient `from-black/80`

**Fonts (next/font)**
- Display: **Space Grotesk** 400–700 (`hero-title letter-spacing -0.03em`, `section-title -0.02em`)
- Body: **Inter** 300–600

**Signature patterns**
- `.text-stroke`: `-webkit-text-stroke 1.5px #F5F5F5; color transparent`; `.text-stroke-accent` stroke `#E8FF00`
- `.work-card`: `border-radius 8px; overflow hidden`; hover img `scale(1.08)` + `brightness(0.4)` + overlay fade
- `.marquee-track`: `inline-flex; animation 25s linear infinite; pause on hover`; items `text-5xl md:text-7xl` bold + accent `✦`; `py-6 border-y border-vol-border`
- `.line-accent`: 3px accent underline scaleX, origin right→left on hover
- `.btn-primary`: pill `radius 100px; bg #E8FF00; color #0A0A0A; font-600; Space Grotesk`; hover `#CCFF00`
- `.stat-number`: `clamp(2.5rem,6vw,5rem)`, weight 700, line-height 1

**Header:** fixed, `mix-blend-difference` z-50. Logo "VOLATILE" Space Grotesk bold 2xl. Nav `hover:text-vol-accent` + `.line-accent`. Accent pill contact.

**Hero:** `min-h-screen` centered-left. Eyebrow accent uppercase; H1 `clamp(3rem,10vw,9rem)` bold, mixing filled white + stroke-accent + accent lines ("We create / brands that [stroke] / refuse to [accent] / blend in."); two pill CTAs; staggered inline delays.

**Section rhythm:** hero → marquee → Selected Work 2-col `.work-card aspect-[4/3]` (accent category tag, 2xl title, gray body) → About (`bg-vol-surface`, accent badge card "120+ / Projects Delivered" at `-bottom-6 -left-6`) → Stats 4-col `.stat-number` (accent on one) → Services preview numbered rows 01–06 `py-8 border-b border-vol-border` → Testimonial centered → CTA `bg-vol-surface`.

**Footer:** `border-t`, giant email `text-4xl md:text-6xl lg:text-7xl` hover accent; 4 social circles.

---

# 3. warm-kitchen ← websites-template/restaurant (Ember & Oak)

**Brand:** Warm, reverent fire-worship; forty-seat intimacy; "Cucina a fuoco vivo." Portland, OR. Est. 2014.

**Palette**
- Bg `#161110` (`--soot`); surface `#201a17` (`--coal`)
- Accent `#df5b32` (`--embers`); warm `#f0a252` (`--flame`); green `#4a5531` (`--herb`)
- Text `#f2e6d3` (`--crema`) at /60 /50 /40
- Borders `#3b2f27` (`--line`); charred gradient `#f0a252 → #df5b32 → #7a2c14`

**Fonts (next/font)**
- Display: **Fraunces** (opsz 144) 400–600 + italics
- Body: **Karla** 400–600
- Mono: **Spline Sans Mono** 400–500

**Signature patterns**
- `.char`: flame→embers→charred gradient text (`background-clip: text; color transparent`)
- `.fire-read`: mono live-readout strip (border-line, bg soot/85) — "Forno live" pulsing dot / "Stone temp 412°C" / "Pizza bake 45 sec" / "Tonight's Table 14"
- `.seal`: 108px circle, `border 2px solid flame`, uppercase 9px `letter-spacing .24em`, `rotate(-8deg)`
- `.dots` dotted-leader (1px dotted line) for menu rows
- `.ember-div`: 1px × 90px embers gradient side-bars + center flame `◆`
- `.marquee-track` 40s, italic Fraunces + flame `◇`

**Header:** fixed h-20; logo Fraunces "Ember *&* Oak" (italic flame &); nav 11px tracking .24em uppercase; CTA "Book a Table" `border border-flame/60` mono, hover fills.

**Hero:** full-bleed oven image, `gradient-to-t from-soot via-soot/60 to-soot/25`, bottom-anchored: mono flame eyebrow; H1 Fraunces `clamp(3rem,9vw,7.5rem)` leading .92, "fire" as italic `.char`; flame-filled CTA + bordered "See the Menu"; `.fire-read` strip at very bottom.

**Section rhythm:** hero → fire marquee → "Tonight" 5/7 grid with aspect-[4/5] image + `.seal` offset + feature card (`bg-coal border-line/40` + `.menu-lead` $29) → "Il forno" centered `.ember-div`, 3 equal `h-[420px]` images with from-soot/80 + italic captions → Menu preview 4/8 rows (mono category + `.menu-lead` dish + flame price, `border-b border-line/40`) → Quote band → Reserve CTA (char-gradient headline + flame button + mono phone).

**Footer:** bg-coal, 12-col, mono headers crema/30; hover flame; "Aperti in cucina."

---

# 4. bistro-menu ← websites/hotel (The Meridian)

**Brand:** Ultra-luxury caldera resort; serene Mediterranean elegance; "Where the Aegean meets unparalleled luxury." Oia, Santorini; 47 suites.

**Palette**
- Bg `#0D1B2A` (`navy`); alt `#1B2D45` (`navy-light`)
- Text `#F0E6D3` (`cream`) at /80…/30; light section `#FAF8F5` with text-navy
- Accent `#C8A96E` (`gold`); muted `#A09880`
- Borders `#2A3F5F` (`navy-border`); frame `border-gold/30`, icon circles `border-gold/40`

**Fonts (next/font)**
- Display: **Cormorant Garamond** 300–700 + italics 300/400
- Body: **Lato** 300/400/700

**Signature patterns**
- `.gold-line` 60×1px gold; `.gold-line-wide` 100px
- Nav underline gold 1px width 0→100%
- `.parallax-bg` (`background-attachment: fixed`)
- Room card hover overlay 0→1; icon circles 16×16 `border-gold/40` hover `bg-gold/10`
- Offset frames: `-bottom-6 -left-6` gold/30 border

**Header:** fixed transparent→navy/95 blur; left links / center logo "THE MERIDIAN" Cormorant `text-2xl md:text-3xl tracking-[0.3em] font-light` / right links; mobile panel w-80 right slide.

**Hero:** full-screen center, `bg-navy/50` overlay: `.gold-line-wide mx-auto`, gold-muted eyebrow "Santorini, Greece", H1 Cormorant `text-5xl md:text-7xl lg:text-8xl font-light`, italic cream/70 subline, CTA `border border-gold text-gold px-10 py-4 text-sm tracking-[0.3em]`.

**Section rhythm:** hero → Welcome 2-col (gold-line, Cormorant light H2, gold text-link, image h-[500px] + gold/30 frame offset) → Rooms `bg-navy-light` 3-col `h-96` image cards, gold price tag, Cormorant 2xl titles → parallax quote h-[60vh] → Dining reversed 2-col → Experiences 4-col icon grid → Testimonial `bg-cream-light text-navy` → Gallery 4-col aspect-square (hover scale 110% + plus icon) → Footer.

**Footer:** bg-navy, 4-col, social circles w-10 h-10 border; newsletter input + gold send.

---

# 5. simple-shop ← websites-template/retail (Arbor & Clay)

**Brand:** Gentle, earthy, patient; herbarium labels, care tags; "Green things in well-made earth." East Austin, TX.

**Palette**
- Bg `#f6f3ea` (`--ivory`); text `#1f2620` (`--ink`)
- Accent `#2f4433` (`--fern`); secondary `#c07754` (`--clay`); sage `#5e7861` (`--moss`); pale `#a6b79c` (`--stem`)
- Borders `#dcd6c4` (`--line`); specimen card `#fdfbf3` shadow `4px 4px 0 var(--fern)`

**Fonts (next/font)**
- Display: **Spectral** 300–500 + italics
- Body: **Instrument Sans** 400–600
- Mono: **Space Mono** 400/700

**Signature patterns**
- `.specimen`: herbarium label card (`bg #fdfbf3; border 1px ink; font-mono`), `.latin` italic, header row 9px tracking .15em uppercase text-clay
- `.care-tag`: mono 9px `letter-spacing .16em` uppercase `border 1px moss; color moss; padding 3px 8px`
- `.dot-lead`/`.dots`: 2px dotted moss leaders
- Nav underline 2px clay

**Hero:** full-bleed greenhouse `gradient-to-t from-ivory`; floating `.specimen` (absolute, `shadow 4px 4px 0 fern`, "Specimen / ACQ. 2026-047 / *Monstera deliciosa*"); mono moss eyebrow; H1 Spectral light `clamp(3rem,9vw,7rem)` leading .95 "Green things / in well-made / earth."; fern-filled CTA + underlined "Come see the greenhouse →".

**Section rhythm:** hero → New arrivals ("Fresh off the truck.") 3-col specimen cards (aspect-[4/5] + `.specimen`: Herbarium/Kiln No., price, latin, care tags) → The Kiln (`bg-fern text-ivory` 6/6, stem eyebrows, offset image pair) → Care Teaser numbered 001–004 rows with dot leaders → Visit strip (`bg-clay text-ivory`).

**Footer:** bg-ink, mono headers ivory/30; hover clay; "Plastic-free since day one."

---

# 6. product-focus ← websites/medical (Clearview Dental)

**Brand:** Modern, warm, high-trust, tech-forward; gentle "anxiety-free" care; "Your Smile, Our Priority." Austin, TX, est. 2015; 15,000+ patients.

**Palette**
- Bg `#FAFBFC` (`clinic-bg`); alt `#F1F5F9` (`clinic-surface`); card `#FFFFFF`
- Text `#1E293B` (`clinic-text`); secondary `#64748B`
- Accent `#0891B2` (`clinic-teal`); dark `#0E7490`; success `#059669`
- Borders `#E2E8F0`; hero gradient `#FAFBFC→#F1F5F9→#E0F7FA`
- Teal glows `rgba(8,145,178,.12/.1/.3)`; footer `#1E293B`

**Fonts (next/font)**
- Display: **Plus Jakarta Sans** 400–800
- Body: **Source Sans 3** 300–700
- Radius: 12px (`rounded-clinic`) buttons/cards/inputs/icons

**Signature patterns**
- `.service-card`: `bg-clinic-white rounded-clinic p-6 border`; hover `translateY(-6px) + shadow teal/10`; `.service-icon` (w-14 h-14 bg-teal/10) hover flips solid teal
- `.stat-card`: `bg-clinic-surface rounded-clinic p-6`; hover lift + teal glow
- `.testimonial-card`: gradient white→`#F8FAFC` rounded-clinic p-8; initials circle bg-teal/10
- `.float-anim`: hero badge floats ±10px, 3s infinite
- Nav underline teal 2px; `.btn-primary` hover lift + teal glow

**Header:** fixed, `bg-clinic-white/90 backdrop-blur border-b`; teal rounded logo square; nav semibold, hover teal; teal "Book Now". Mobile: `max-height` expand-in-place.

**Hero:** `hero-gradient pt-32 pb-20 lg:pt-40 lg:pb-28`, 2-col; teal/10 rounded-full badge "Trusted by 15,000+ Austin Families"; H1 Plus Jakarta extrabold `text-4xl sm:text-5xl lg:text-6xl` + teal accent; teal CTA + white outlined; image `rounded-[20px] shadow-2xl shadow-teal/10` + floating white stat badge (green shield "11 Years / of Excellence", `-bottom-6 -left-6`).

**Section rhythm:** hero → Trust stats 4-col `.stat-card` → Services 4-col `.service-card` icon hover swap → Why Choose Us 2-col with teal feature icon rows → Team 3-col white cards → Testimonials 3-col with amber stars → CTA banner `bg-clinic-teal` white H2 → Footer `bg-clinic-text`.

---

# 7. professional-profile ← websites-template/professional (Harlan & Co.)

**Brand:** Quietly authoritative, three-generation ledger tradition; "kept so honestly they read like plain English." Chicago, IL. Est. 1974.

**Palette**
- Bg `#f4efe3` (`paper`); surface `#fbf7ec` (`parchment`)
- Text `#10232e` (`navy`); secondary `#5f7d96` (`mist`)
- Accent `#b08d4a` (`brass`); ruling gold `#a8873f`
- Borders `#d8cfbb` (`line`); dark `#0b141d` (`coal`); ledger shadows `rgba(15,33,56,.05/.25)`

**Fonts (next/font)**
- Display: **Source Serif 4** 300–600 + italics (already loaded as --font-serif2)
- Body: **Mulish** 400–700
- Mono/ledger: **Fragment Mono** (italics)

**Signature patterns**
- `.ledger`: `background parchment; border-left 3px solid brass` + `box-shadow 0 1px 0 …(+light), 0 12px 40px -24px …(25%)`; `.ledger-head` Fragment Mono 0.7rem `letter-spacing .22em` uppercase ("From the journal / Ledger H-C 1974")
- `.lentry`: grid `minmax(0,1fr) auto auto`, `border-bottom dotted #d8cfbb`; `.title` Source Serif 500; `.memo` Fragment Mono .72rem 55% navy; `.amt` Fragment Mono tabular right min-width 4.2rem
- `.ledger-rule-top` 1px gold; `.ledger-rule-thick` 3px double gold
- `.stamp`: Fragment Mono .66rem `letter-spacing .28em` uppercase, `border 1px currentColor`, `rotate(-2.5deg)`

**Header:** always `bg-paper/95 backdrop-blur border-b`; logo Source Serif "Harlan *&* Co." (brass &) + mono block "Chartered accountants · est. 1974"; nav 11px tracking .18em navy/70; CTA `bg-navy text-paper` Fragment Mono "Begin a conversation" hover bg-brass.

**Hero:** typographic no image, `pt-40 lg:pt-52`: fragment-mono brass eyebrow "Principal journal · Chicago, IL"; H1 Source Serif light `clamp(2.8rem,7vw,5.6rem)` leading .95 ("plain English." italic brass); mist blurb; navy-filled mono button "Read this month's journal".

**Section rhythm:** hero → Ledger strip (`max-w-[820px]`): `.ledger` card, 4 `.lentry` rows (street-level inventory `$—`; 412 family businesses; 100% audits; 52 years) + `.ledger-rule-thick` footer "Carried forward to engagement" + brass link → Services `bg-parchment` 4/8 grid "Four ledgers, one ethic." + 4 serif names → Quote band `bg-navy text-paper` centered italic serif → Image+text "We work in your kitchen, not your vestibule." → Filing cards 2-col `border bg-parchment p-8/10` brass mono headers.

**Footer:** bg-coal; mono headers paper/30; hover brass; "Figures reconciled monthly."

---

# 8. consultant-page ← websites/construction (Ironclad Builders)

**Brand:** Heavy-duty, scale-confident, safety-first; "Building America's Future." Chicago, est. 1987; 800+ team.

**Palette**
- Bg `#111111` (`iron-black`); surface `#1A1A1A`; lighter `#222222`
- Text `#F5F5F5`; secondary `#999999`
- Accent `#F59E0B` (`iron-amber`); dark `#D97706`; steel `#64748B`
- Borders `#333333`; hero overlay `rgba(17,17,17,.7)`; CTA band solid amber

**Fonts (next/font)**
- Display: **Barlow Condensed** 400–800
- Body: **IBM Plex Sans** 300–600

**Signature patterns**
- `.stat-border`: `border-left 3px solid amber`
- `.service-card`: `bg-iron-black border p-8`; hover `border-amber + translateY(-4px)`
- Hero bg: dark overlay + cover image
- Stats bar: `divide-x`, amber extrabold `text-4xl sm:text-5xl`, gray uppercase labels; counters rAF 2000ms

**Header:** fixed `bg-iron-black/90 backdrop-blur border-b`; logo "IRONCLAD" amber + "BUILDERS" white condensed extrabold; nav `tracking-widest uppercase` gray→amber; amber contact CTA; mobile slide-from-right.

**Hero:** `.hero-bg min-h-screen` left; amber eyebrow "Est. 1987 — Chicago, Illinois"; H1 extrabold `text-6xl sm:text-7xl lg:text-8xl uppercase leading-[0.9]` ("America's" amber); amber filled + outlined CTAs; bounce chevron.

**Section rhythm:** hero → Stats bar 4-col → About teaser (amber eyebrow, extrabold H2, image h-[500px] + amber badge `-bottom-6 -left-6`) → Services `bg-iron-surface` 3-col `.service-card` amber icons → Featured Projects 3-col `h-80` gradient cards amber categories + meta → CTA banner amber bg black text → Footer.

---

# 9. clean-portfolio ← websites-template/portfolio (Mara Ellsworth)

**Brand:** Quietly intense, editorial, print-obsessed; "the ordinary world, shot like it matters." Portland, OR. Est. 2015.

**Palette**
- Bg `#edeae0` (`bone`); text `#1d1d1d` (`ink`); secondary `#777` (`ash`)
- Accent `#a63a2c` (`red`); borders `#d4cfc2` (`line`)
- Contact-sheet bg `#e2dfd4`; frame-number pill `rgba(23,23,23,.55)`; dark `#1d1d1d`

**Fonts (next/font)**
- Display/body: **Archivo** 300–700 + italics
- Mono: **JetBrains Mono** (already loaded as --font-mono)

**Signature patterns**
- `.regs`: registration marks — `::before` top-left red 2px borders (14×14, z-2), `::after` bottom-right
- `.contact`: `aspect-ratio 3/4; border 1px #d4cfc2; bg #e2dfd4;` `.no` mono 0.56rem `letter-spacing .12em` bone text on dark pill `left:6px bottom:6px`
- `.frame-line`: `border 1px #d4cfc2`
- `.plate`: mono .64rem `letter-spacing .22em` uppercase (image captions "Plate 01 · 12 images")

**Header:** fixed h-[72px] `bg-bone/95 blur border-b`; logo Archivo semibold 15px `tracking-[0.18em]` uppercase + mono block 8px "documentary · editorial · est. 2015"; nav 11px `tracking-[0.2em]` ink/60; CTA "Contact" `border border-ink` mono, hover inverted.

**Hero:** typographic `pt-32 lg:pt-44` baseline row: mono red eyebrow "Work in progress · Portland, OR"; H1 Archivo light `clamp(2.6rem,6.5vw,5.2rem)` leading .96 "The ordinary world, / shot like it matters."; right ash blurb.

**Section rhythm:** hero → Contact-sheet strip: horizontal scroll `flex gap-[2px] min-w-[800px]` of 7 `.contact.regs` (w-120/180) frame numbers 01–07 → Featured essays 2-col `aspect-[3/4] frame-line` + red mono plates → Statement `bg-ink text-bone` centered quote → Strip archive 7-col `grid gap-[2px]` of 12 thumbs numbered 008–019 → CTA centered outlined → Footer.

**Footer:** bg-ink, 12-col, mono headers bone/30; hover red; client logos; "Film is dead, long live the grain."

---

# 10. visual-showcase ← websites/architecture (Atelier Voss)

**Brand:** Refined, timeless, material-respectful; "Spaces that endure." New York, est. 2009.

**Palette**
- Bg `#F5F0EB` (`warm-bg`); surface `#E8E0D8` (`warm-surface`)
- Text `#1A1A1A`; secondary `#6B6B6B`
- Accent `#C4956A` (`warm-accent`, gold-bronze); borders `#D4CCC4`
- Hero overlay `from-warm-text/60 via/10 to-transparent`; CTA overlay `bg-warm-text/70`; footer `bg-warm-text` white text

**Fonts (next/font)**
- Display: **Playfair Display** 400–700 + italics
- Body: **Inter** 300–600

**Signature patterns**
- Asymmetric grids (7/5, 5/7, 8/4 col-span variants)
- Image hover `group-hover:scale-105` (700ms) + title hover accent
- Counters: Playfair `text-5xl lg:text-6xl` gold + uppercase micro-labels; `increment = target/60`, 30ms interval, appends `+`
- Reveal delays `-1/-2/-3`

**Header:** fixed, transparent→`bg-warm-bg/95 blur`; logo "AV" Playfair 2xl + mono `text-xs tracking-[0.3em] uppercase` "Atelier Voss"; nav `text-xs tracking-[0.15em] uppercase`.

**Hero:** full-screen image `min-h-[700px]` bottom-up overlay; eyebrow `text-warm-bg/70 text-xs tracking-[0.4em] uppercase`; H1 Playfair `text-5xl md:text-7xl lg:text-8xl` white medium leading .95 with italic "endure"; gold-filled "View Projects" + white/30 outlined "Our Studio".

**Section rhythm:** hero → Featured Projects asymmetric 7/5 + meta "New York, NY — 2024" + gold category tag → Statement `bg-warm-surface` 5/7 with portrait + Playfair H2 italic em → Stats 4-col counters → Journal 3-col `border-t` cards → CTA h-[60vh] image + dark overlay centered gold button → Footer `bg-warm-text text-white`.

---

## Cross-reference notes

- 5 shared external-asset sites (`websites-template/*`): shared JS skeleton (menu overlay `.open`, navbar `.scrolled`, IntersectionObserver reveal threshold 0.12, `prefers-reduced-motion`), `max-w-[1320px]` (portfolio 1400px).
- 5 inline sites (`websites/*`): getBoundingClientRect scroll reveal (agency/architecture use IO), no reduced-motion handling.
- Product invariant (never broken, from EPIC.md): Arabic is first-class RTL. All EFG & label treatments must degrade gracefully for Arabic (`:lang(ar)` swaps) — bold signatures (Barlow Condensed, Fraunces, Spectral) are Latin-only; Arabic must fall back to `--font-ar-serif`/`--font-ar-sans` per globals.css rules, preserving caps/tracking only where glyphs allow.