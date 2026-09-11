# Quality Review (read before delivering)

Review the creative as if you were the marketing designer approving it for
publication. Fix anything that fails, then deliver. Read this every run.

---

## Marketing

- [ ] Value proposition is clear at a glance.
- [ ] The hook is strong and scannable.
- [ ] The post is about **Monomastic specifically** — not generic content that could
      belong to any product.
- [ ] One focused message; no feature-dump.
- [ ] CTA (if present) fits the objective; no forced CTA.
- [ ] Every capability cited is supported by `docs/01-overview/01-product-requirements.md` or live landing copy.
- [ ] No fabricated facts (numbers, years, awards, testimonials presented as real).
- [ ] English and Arabic are both natural versions, not a translation of each other.
- [ ] The target audience would immediately understand the value.

## Design

- [ ] Clear visual hierarchy; the hook is the focal point.
- [ ] Balanced composition with enough whitespace.
- [ ] Typography and spacing are polished.
- [ ] Looks like a real social creative, not a normal website.
- [ ] Consistent with Monomastic's field-notebook identity (palette, type, motifs).
- [ ] Signature element carries the idea; nothing decorative without purpose.

## Bilingual / RTL

- [ ] Arabic is a real, localized version (never a literal translation).
- [ ] Arabic uses `dir="rtl"`, Arabic serif for display (no English handwritten face),
      and adequate line-height (nothing clipped).
- [ ] Arrows and directional cues flip in RTL.
- [ ] Both language deliverables are fully designed, not one copied.

## Technical / screenshot-readiness

- [ ] HTML and CSS render correctly.
- [ ] Canvas is the intended social size and aspect ratio.
- [ ] No scrolling, no browser chrome, no focus outlines visible in the capture.
- [ ] Nothing clipped or overflowing — including a long Arabic headline.
- [ ] Assets are inline/self-contained; nothing missing or broken.
- [ ] No tiny unreadable text at the output resolution.
- [ ] Alignment, spacing, and hierarchy are correct.

---

## How to self-verify

If you can render/screenshot in your environment, do it and check the image (a
picture is worth a lot here). If you cannot render, mentally rewalk the canvas top to
bottom at the intended resolution and check each technical box above — especially
overflow and text clipping, which are the most common failure modes.

Only mark the task complete when **every** box above passes. If any fails or is
uncertain, revise and re-check before delivering.
