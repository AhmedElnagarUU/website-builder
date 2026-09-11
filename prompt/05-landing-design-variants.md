ROLE: You are a senior product designer specializing in premium dark-mode tech/AI landing pages. You understand how to build a strong visual "signature" (background treatment, atmospheric glow, connector line-art, glass UI elements, typography rhythm) and then re-skin it consistently across color variants — not redesign it from scratch each time.

TASK: Generate 7 landing page variations (HTML + CSS only — no JS frameworks, no backend) for a single product. All 7 must share the EXACT SAME visual spec below (layout, structure, effects, typography, spacing) — the ONLY thing that changes between variations is the accent color story. This step is to pick the best accent color/mood on top of one locked design direction, not to compare different styles.

STEP 1 — UNDERSTAND THE PRODUCT FIRST
Before writing any code, read PRD.md and any other .md files in this project to understand the product, its audience, and its tone, so the copy in the hero/features feels real (not filler) and so you can recommend which accent color fits best in Step 3.

STEP 2 — LOCKED DESIGN SPEC (apply identically to all 7 variations)
This is the reference aesthetic — a premium, dark, AI/tech-forward look:

- Background: deep near-black / charcoal (#0a0a0a–#121212 range), not pure black — with subtle texture or gradient, never flat.
- Atmospheric glow: one large soft radial gradient glow blooming from a corner or behind the hero visual, fading smoothly into the dark background. This glow's hue is the ONLY thing that changes per variation.
- Connector line-art: thin, glowing circuit-style lines linking small circular icon nodes scattered around the hero visual, converging toward a central badge/icon element — conveys "network/AI" visually without needing real illustration.
- Navigation: minimal top bar, glassy/blurred pill-shaped background, logo on the left, nav links center or right, an outlined "Log in" button and a solid accent-colored pill "Sign up" / primary CTA button on the right.
- Eyebrow badge: small pill-shaped label above the headline (subtle border, tiny icon + short text) to set context before the main headline.
- Headline: oversized, bold, centered, white or near-white, tight letter-spacing, short and punchy — the real product value proposition from the PRD.
- Subheadline: shorter, muted grey, centered below headline.
- Primary CTA: accent-colored pill button, high contrast against the dark background.
- Optional hero media: a frosted-glass circular play button or product visual placeholder centered in the hero graphic area.
- Vignette: edges of the hero/page subtly darken to frame the glow and keep focus centered.
- Typography: clean geometric sans-serif throughout (e.g. Inter or similar), generous vertical whitespace between sections, consistent 8px spacing rhythm.

STEP 3 — 7 COLOR VARIATIONS OF THE SAME SPEC
Keep every structural element above identical. Change ONLY the accent/glow color system per file:
1. Orange → Red glow (signature/reference version — warm, energetic, AI-industrial)
2. Electric blue → Cyan glow (cool, technical, precise)
3. Violet → Magenta glow (creative, premium, futuristic)
4. Emerald → Teal glow (calm, trustworthy, "growth" feel)
5. Amber → Gold glow (luxury, high-end, warmer than orange)
6. Pink → Red glow (bold, modern, attention-grabbing)
7. Monochrome white/grey glow, no color accent — pure light-and-shadow contrast (minimal, ultra-premium)

For each, the glow color also drives the accent CTA color, node/line-art color, and any highlighted text — keep it consistent within that one file.

Keep IDENTICAL content across all 7 (only the color changes), using the real product from the PRD:
1. Header/nav as specified above
2. Hero — eyebrow badge, headline, subheadline, primary CTA, hero visual with glow + line-art
3. Features / "how it works" — 3–4 items reflecting actual product capabilities
4. Social proof — testimonial or trust section
5. Final CTA section
6. Simple footer

STEP 4 — OUTPUT
Generate a simple index.html linking to all 7 variations.
Then list all 7 with: the accent color name/hex, and one line on the mood it creates — plus a recommendation of which 1–2 best fit this specific product based on the PRD.

Constraints: plain HTML/CSS only, no frameworks. Prioritize matching the locked spec's craft and mood precisely — this reference-level polish is the bar, not a generic dark theme.