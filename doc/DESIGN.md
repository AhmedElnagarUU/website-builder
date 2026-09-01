# loom — Landing Page Design Spec

> Locked visual spec for the loom marketing landing page.
> One design direction, re-skinned in a single accent system (Orange → Red).
> The 7-color exploration this was picked from lives in `design-scratch/landing-variants/`.

---

## 1. Direction

Premium, dark, AI/tech-forward. The "signature" of this page is:

- Deep near-black background, never flat.
- A large soft radial glow blooming from the top-center of the hero.
- A thin glowing connector line-art network converging on a central badge.
- Glassy, blurred pill nav floating over the dark canvas.
- Oversized, tight, near-white headline with an accent-gradient emphasis.
- Restrained UI chrome — no shadows on text, no decorative borders.

Tone: **bold and techy, but not developer-flavored.** Reads as "AI that gets things done," not "AI for engineers."

---

## 2. Locked Color System

These are the production colors. The `--accent-*` variables are the only thing the implementation swaps to re-skin variants; the rest of the palette is locked across the brand.

### 2.1 Accent (Orange → Red)

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Accent (light) | `--accent` | `#ff7a3d` | Headline gradient (top), brand mark, glow inner, eyebrow dot, line-art node fill |
| Accent (deep) | `--accent-strong` | `#ff2a0a` | Headline gradient (bottom), primary CTA bottom, badge gradient |
| Accent soft | `--accent-soft` | `rgba(255, 80, 25, 0.22)` | Feature card top-glow, halo around icons, CTA halo |
| Accent glow (primary) | `--accent-glow` | `rgba(255, 60, 15, 0.55)` | Primary CTA outer shadow, badge glow, center glyph |
| Accent glow (secondary) | `--accent-glow-2` | `rgba(255, 30, 0, 0.30)` | Secondary radial bloom in hero |
| Line color | `--line-color` | `rgba(255, 110, 50, 0.6)` | SVG connector lines in the hero visual |

> **Why these values and not the literal brand-doc hexes (`#FF4D00`)?** The brand doc's primary `#FF4D00` reads too saturated/burnt on a dark hero. We pull toward orange (`#ff7a3d`) at the top of the gradient and slide to red (`#ff2a0a`) at the bottom for warmth + energy + a single recognizable hue family. This is the same hue family as the brand doc — just lifted for dark-mode legibility, exactly as `brand-identity-output.md` Part 2, item 1 ("dark-mode primary `#FF6B2C`") prescribes.

### 2.2 Base (locked — do not change per variant)

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background 0 | `--bg-0` | `#0a0a0c` | Page base |
| Background 1 | `--bg-1` | `#0f0f12` | Mid-page gradient stop |
| Background 2 | `--bg-2` | `#131318` | Reserved, top-of-page lift |
| Surface | `--surface` | `rgba(255, 255, 255, 0.03)` | Card backgrounds |
| Border | `--border` | `rgba(255, 255, 255, 0.08)` | All 1px borders, dividers |
| Text 0 (primary) | `--text-0` | `#f5f5f7` | Headlines, primary text |
| Text 1 | `--text-1` | `#c8c8d0` | Subhead, body, nav links |
| Text 2 | `--text-2` | `#8a8a96` | Labels, captions |
| Text 3 | `--text-3` | `#5a5a66` | Tertiary, step numbers |
| Inverse (on accent) | — | `#0a0a0c` | Text/icon on accent fills |

**Never use pure black (`#000`) or pure white (`#fff`) on this page.** Off-blacks and near-whites only — see CODE_RULES.md equivalent in the parent orchestration doc.

### 2.3 Functional

| Element | Color | Notes |
|---------|-------|-------|
| Page background | `radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.04), transparent 60%), linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 50%, var(--bg-0) 100%)` | Subtle lift at top, never flat |
| Hero glow | `radial-gradient(60% 50% at 50% 30%, var(--accent-glow) 0%, transparent 60%)` + secondary at 70%/20% | Atmospheric, not solid |
| Hero vignette | `radial-gradient(120% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)` | Frames the glow, keeps focus centered |
| Grid overlay (final CTA) | `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)` at 48px | Masked with radial fade |

---

## 3. Typography

**Family:** `Inter`, with system-ui fallbacks. Single family for the whole page — no display/serif mix.

**Type scale (px):** 12 · 13 · 14 · 16 · 18 · clamp(28, 3.4vw, 42) (section h2) · clamp(28, 3.6vw, 44) (final CTA h2) · clamp(40, 6.4vw, 76) (hero h1).

| Element | Size | Weight | Letter-spacing | Color |
|---------|------|--------|----------------|-------|
| Hero h1 | 40–76px (clamp) | 700 | -0.035em | `#fff`; accent span uses gradient text |
| Section h2 | 28–42px (clamp) | 700 | -0.025em | `#fff` |
| Final CTA h2 | 28–44px (clamp) | 700 | -0.025em | `#fff` |
| Body / subhead | 16–18px | 400 | 0 | `--text-1` |
| Eyebrow | 12.5px | 500 (label uses 600) | 0 | `--text-1`, label b uses `--text-0` |
| Section eyebrow ("Product", "How it works"…) | 13px | 600 | +0.08em, uppercase | `--accent` with `text-shadow: 0 0 20px var(--accent-soft)` |
| Nav links | 14px | 500 | 0 | `--text-1` |
| Buttons | 14–15px | 600 | -0.01em | Primary is `#0a0a0c`; ghost is `--text-0` |
| Testimonial blockquote | 18px | 500 | -0.01em | `#fff` |
| Metric value | 34px | 700 | -0.02em | `#fff`, accent span uses gradient |
| Metric label | 13px | 400 | 0 | `--text-2` |
| Footer | 13px | 400 | 0 | `--text-2` |

---

## 4. Spacing & Layout Rhythm

8px base unit. All vertical rhythm and component padding must use these tokens:

`--s-1: 4px` · `--s-2: 8px` · `--s-3: 16px` · `--s-4: 24px` · `--s-5: 32px` · `--s-6: 48px` · `--s-7: 64px` · `--s-8: 96px` · `--s-9: 128px`

| Component | Padding / gap |
|-----------|---------------|
| Nav outer | `var(--s-3) var(--s-4)` |
| Nav pill inner | `10px 14px 10px 18px`, gap `var(--s-4)` |
| Hero | `var(--s-9) var(--s-4) var(--s-8)` |
| Section | `var(--s-9) var(--s-4)` |
| Final CTA inner | `var(--s-9) var(--s-5)` |
| Footer | `var(--s-6) var(--s-4)` |
| Feature card | `var(--s-5)` all |
| Step card | `var(--s-5)` all |
| Testimonial / metric | `var(--s-5)` all |
| Section header to body | `var(--s-7)` below header |

**Max content width:** `1080px` (`.section-inner`, `.container`, `.nav-pill`).
**Hero headline max width:** `980px`.
**Subhead max width:** `640px`.
**Final CTA max width:** `560px` (paragraph).

---

## 5. Components

### 5.1 Navigation
- Sticky, `z-index: 50`, `position: sticky; top: 0`.
- Centered glassy pill, `border-radius: var(--radius-pill)` (999px), `padding: 10px 14px 10px 18px`.
- Glass: `background: rgba(15, 15, 20, 0.55)` + `backdrop-filter: blur(18px) saturate(140%)` + 1px `var(--border)`.
- Internal shadow: `0 10px 30px rgba(0,0,0,0.4)`.
- Layout: `[brand] [links] (ml-auto) [Log in] [Start free]`.
- Brand mark: 26×26, gradient `var(--accent) → var(--accent-strong)`, 7px radius, inner cutout 6px, inset white border 0.18 alpha.

### 5.2 Primary CTA (the only saturated button on the page)
- Pill, `border-radius: var(--radius-pill)`.
- Background: `linear-gradient(180deg, var(--accent) 0%, var(--accent-strong) 100%)`.
- Color: `#0a0a0c` (dark text on light orange/red).
- Shadow stack (in order): `inset 0 0 0 1px rgba(255,255,255,0.08)`, `0 8px 24px var(--accent-soft)`, `0 0 30px var(--accent-glow)`.
- Hover: shadow alpha and spread increase slightly.
- Active: `translateY(1px)`.
- Sizes: regular `10px 18px` / 14px font; large `14px 24px` / 15px font.

### 5.3 Ghost / Log in button
- Pill, `background: rgba(255,255,255,0.02)`, `border: 1px solid var(--border)`, color `--text-0`.
- Hover: `border-color: rgba(255,255,255,0.18)`.

### 5.4 Eyebrow badge (above headline)
- Pill, `padding: 6px 12px 6px 8px`, `border: 1px solid var(--border)`, `background: rgba(255,255,255,0.02)`, `backdrop-filter: blur(8px)`.
- 8×8 dot at left: `background: var(--accent)`, `box-shadow: 0 0 10px var(--accent)`.
- Text: `--text-1` with `<b>` for emphasis in `--text-0`.

### 5.5 Headline accent span
- The phrase "written in about a minute." (or its AR equivalent) is wrapped in `<span class="accent">`.
- `background: linear-gradient(180deg, var(--accent) 0%, var(--accent-strong) 100%)` + `background-clip: text` + `color: transparent`.
- `filter: drop-shadow(0 0 24px var(--accent-soft))`.

### 5.6 Hero visual (the connector line-art)
- Container: `width: min(880px, 100%)`, `aspect-ratio: 16/9`, `border-radius: var(--radius-lg)`, 1px border, dark surface, 30/80/0.55 outer shadow.
- Grid background: 40px CSS grid, masked with a 60%/60% radial fade from center.
- Center badge: 96×96, `border-radius: 26px`, glass fill, accent halo.
- Center glyph: 46×46, gradient `var(--accent) → var(--accent-strong)`, inner 10px cutout, accent glow.
- Connector network: 12 SVG lines + 6 main nodes + 6 glow halos, viewBox `0 0 880 495`. Lines stroke `var(--line-color)`, nodes fill `var(--bg-0)` with `stroke: var(--accent)`, halos fill `var(--accent)` at 0.25 opacity.
- "Live preview" play pill: bottom-center, glassy pill with 26×26 gradient dot.

### 5.7 Feature card (×4)
- `padding: var(--s-5)`, `border: 1px solid var(--border)`, `border-radius: var(--radius-md)`, `background: var(--surface)`.
- Top-glow pseudo `::before`: radial `var(--accent-soft) → transparent` from top, 0.35 opacity.
- Icon tile: 40×40, `border-radius: 12px`, dark glass, 1px border, `color: var(--accent)`, halo via `box-shadow: 0 0 24px var(--accent-soft)`.
- 4-up grid, collapses to 2-up at ≤980px, 1-up at ≤560px.

### 5.8 Step card (×3)
- Same surface as feature card, plus a small `Step 01/02/03` label at top-right (`counter-increment: step`, content via `counter(step, decimal-leading-zero)`).
- The number is colored `var(--accent)`, the "Step" label is `--text-3`.

### 5.9 Testimonial / metrics
- Testimonial block: standard surface card, 18px blockquote in `#fff`.
- Featured testimonial gets an extra `radial-gradient(120% 80% at 0% 0%, var(--accent-soft) 0%, transparent 60%)` overlay and a brighter border.
- Avatar: 30px circle, `linear-gradient(135deg, var(--accent), var(--accent-strong))`, halo.
- Metrics: large number with `<span class="accent">` using the same gradient-text treatment; label in `--text-2`.

### 5.10 Final CTA
- 1080px max, `padding: var(--s-9) var(--s-5)`, `border-radius: var(--radius-lg)`, top accent-glow + dark surface.
- Grid overlay: 48px CSS grid, masked with a 60%/70% radial fade.
- Two-button row, primary + ghost.

### 5.11 Footer
- 1px top border, `padding: var(--s-6) var(--s-4)`, `--text-2`, 13px.
- Flex row: copyright left, links right (`Privacy · Terms · Support · EN / العربية`).

---

## 6. Effects Library

| Effect | Where | Spec |
|--------|-------|------|
| Glass blur | Nav pill, eyebrow, play pill, center badge | `backdrop-filter: blur(8–18px) saturate(140%)` over a translucent dark fill |
| Atmospheric glow | Hero | Two stacked `radial-gradient`s with `filter: blur(20px)`, behind content (`z-index: -2`) |
| Vignette | Hero | `radial-gradient(120% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)` |
| Grid overlay | Hero visual, final CTA | 40px / 48px linear-gradient grid, masked with radial fade |
| Outer glow on accent | CTA, badge, icon tile, brand mark | Layered `box-shadow` with `var(--accent-soft)` and `var(--accent-glow)` |
| Gradient text | Headline accent, metric values | `background-clip: text` + `color: transparent` + `filter: drop-shadow` |
| Top-glow on cards | Feature card `::before` | Radial `var(--accent-soft)` from top, 0.35 opacity |
| Hover lift | Feature cards | `transform: translateY(-2px)` + brighter border |

---

## 7. Copy (locked — English)

> These are the actual lines on the production page. Translations for Arabic are scoped to a future RTL variant of the same spec, **not** a translation of these strings — see PRD §13.4.

- **Eyebrow:** "New · Bilingual sites in one go — English & Arabic, generated together"
- **Headline:** "Your website, written in about a minute."
- **Subhead:** "loom turns a few plain answers about your business into a real, published website — no template-juggling, no drag-and-drop, no design decisions."
- **Primary CTA:** "Start free →"
- **Secondary CTA:** "See how it works"
- **Caption:** "No credit card · Live in ~60 seconds"
- **Section 1 (Product):** "A website, not a builder." / "You answer a few questions about your business. loom writes the site. You lightly edit it, then publish."
- **Section 2 (How it works):** "From 'I need a website' to a live link." / "No canvas, no learning curve. The product is designed to remove decisions, not add them."
- **Section 3 (Customers):** "Built for people who don't want to build websites." / "Small business owners, freelancers, and local services who needed a real link, not a project."
- **Final CTA:** "Skip the builder. Get the website." / "Tell loom about your business in plain words. Walk away with a real, published site before your coffee gets cold."
- **Footer:** "© 2026 loom · Made for people who don't do design." · `Privacy · Terms · Support · EN / العربية`

---

## 8. Source of truth

The 7 exploration files in `design-scratch/landing-variants/` are **non-canonical** artifacts kept for reference and to show why this direction was picked. The canonical production spec is:

- `1-orange-red.html` — structure, content, and class names.
- `base.css` — the locked design system (colors, type, spacing, components, effects). Re-using `base.css` in the Next.js app is the right way to bring this into the product.

When the marketing page is implemented in the app, the file `1-orange-red.html` is the reference HTML to translate to React/TSX. The CSS variables in `base.css` are the only place color decisions live — do not hardcode hex values in component files.

---

## 9. Variants considered (and why they were not picked)

| # | Accent | Mood | Verdict |
|---|--------|------|---------|
| 1 | Orange → Red | Warm, energetic, AI-industrial | ✅ **Picked** — brand-aligned, cross-market, distinctive without being a cliché |
| 2 | Electric blue → Cyan | Cool, technical, precise | ❌ Cliché "AI tool" palette; reads as developer infrastructure, not SMB product |
| 3 | Violet → Magenta | Creative, premium, futuristic | ⚠️ Strong but consumer-AI flavored; risks looking like a creator tool |
| 4 | Emerald → Teal | Calm, trustworthy, growth | ✅ Best **alternative** — viable as a per-site brand color in the editor (PRD §12.2) |
| 5 | Amber → Gold | Luxury, high-end | ❌ Off-brand luxury; better suited to a boutique than a tool |
| 6 | Pink → Red | Bold, modern, attention-grabbing | ❌ Wrong audience — leans Gen-Z consumer / beauty app |
| 7 | Monochrome white/grey | Minimal, ultra-premium | ⚠️ Beautiful but quietest; consider as a one-off AR/RTL marketing variant if needed |
