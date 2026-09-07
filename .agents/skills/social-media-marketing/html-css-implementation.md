# HTML/CSS Implementation (after design is locked)

Turn the designed social creative into a self-contained HTML/CSS page that can be
opened in a browser and screenshotted directly for publishing on social media.

Follow `visual-design.md` exactly — derive every color, type, and spacing decision
from the brand reference, never from off-brand defaults.

---

## Canvas & dimensions

- Give the `<body>` **no page scaffolding** — the creative is the whole thing.
- Fix a **social-friendly canvas size and aspect ratio**. Choose based on platform or
  the user's request:

| Platform / format | Suggested canvas (px) |
|---|---|
| Instagram Post (square) | 1080 × 1080 |
| Instagram/Stories (portrait) | 1080 × 1920 |
| X / Twitter post | 1600 × 900 (or 1200 × 675) |
| LinkedIn post | 1200 × 627 |
| Facebook post | 1200 × 630 |

- If the user names a platform or dimensions, follow theirs. If they name only a
  format, choose a sensible size and document the choice in a comment.
- Set the canvas with a fixed width/height (e.g. `width:1080px; height:1080px`),
  centered on the page, with the brand background filling the whole canvas.

---

## Screenshot-readiness requirements (non-negotiable)

- **Fixed visual canvas** with a hard width and height.
- **No scrolling** — nothing can overflow the canvas; `overflow:hidden` on the canvas.
- **No clipped text** — every line must fully fit; test long headlines, and for
  Arabic check descenders/line-height (Arabic has taller/full-height letterforms —
  give extra line-height).
- **No missing assets / broken layout** — all images/icons are inline SVG or
  self-contained (use system-safe fonts or import fonts via `<link>` with fallbacks).
- **No browser-like UI** — no scrollbars, no focus outlines, no default avatars.
- **No tiny unreadable text** — mind the minimum legible size at the real output
  resolution; label/caption text stays readable.
- **Correct alignment, spacing, and hierarchy** matching the design.
- The page must look like a **finished social media design**, not a website. When
  someone opens the file, captures the canvas, and publishes the image, it should be
  complete.

---

## Structure & style conventions

- Use **semantic HTML** and modern **CSS** (Grid/Flexbox, gradients, shapes, careful
  typography). Reusable classes, consistent spacing from a small token set.
- Keep it a single self-contained HTML file (one `<style>` block) so it is trivial to
  open and screenshot. Inline SVG for any icon/mark, no external images.
- Use the brand tokens as CSS custom properties at `:root` so all color decisions
  live in one place (mirror `product-and-brand.md`):
  ```css
  :root {
    --paper:#f5efdf; --paper-2:#ebe3d0; --ink:#2a2622; --ink-2:#5c544a;
    --ink-3:#8e8576; --red:#b23a48; --blue:#2d5ba8; --yellow:#e8b53c;
    --green:#4a6b3d; --line:#b4c8e8; --rule:rgba(42,38,34,.2);
    --shadow:4px 4px 0 rgba(42,38,34,.08); --radius:4px;
  }
  ```
- Signature how-tos:
  - Handwritten English display: `font-family` a handwritten face (load Caveat via a
    `<link>` with a strong system fallback), used only for accent words/sticky notes.
  - Sticky note / tape: yellow fill, `rotate(-2deg)`, hard shadow, small radius.
  - Red accent text: `color:var(--red)`; blue wavy underline under a red word:
    `text-decoration:underline wavy var(--blue)`.
  - Hard offset shadow on cards/buttons: `box-shadow:var(--shadow)`.
  - Ruled-line backdrop: a subtle `repeating-linear-gradient` of `--line` every 32px
    at low opacity, plus an optional thin vertical red margin line.

---

## RTL & Arabic (critical)

- For Arabic content set `dir="rtl"`, `lang="ar"`, and right-aligned flow.
- Arabic display type must use an Arabic serif — **never** the English handwritten
  face.
- Give Arabic text generous `line-height` (Arabic letterforms are tall and many
  combine) so nothing clips.
- Directional cues (arrows like `→`) flip in RTL (`transform: scaleX(-1)` or use the
  LTR/RTL-aware mark). Right-to-left reading order for bullets/meta rows.
- Facts and brand marks stay identical across languages; only phrasing/tone differ.

---

## Bilingual delivery

If delivering a **single bilingual canvas**, lay out the two languages on-brand (e.g.
English on the left LTR and Arabic on the right RTL, or a designed split) with equal
care. If delivering **two separate monolingual creatives**, produce one self-contained
HTML file per language, each screenshot-ready. State the file(s) you produced and
what dimensions each is.

---

## Before you're done with the file

Verify: no scrollbars, no overflow, no clipped text (do a longer-than-normal Arabic
headline), the right canvas size, assets internal, brand colors/type correct, and the
visual hierarchy matches the design. Then run the quality review before delivering.
