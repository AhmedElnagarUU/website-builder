# Milestone 06 — Responsive & Visual Polish + Final Review

## Goal
Validate every template across desktop/tablet/mobile, fix spacing/alignment/overflow/type issues, refresh the card thumbnails to match the new design language, and produce the final before→after quality review that closes the epic.

## Tasks (execution order)
1. **01-responsive-states-assets.md** — Responsive + interaction-states audit and fixes; refresh `public/templates/<id>/preview.svg`.
2. **02-final-quality-review.md** — Full before→after review against the epic's quality bar; write `quality-review.md`.

## Shared context (binding for this milestone)
- The responsive model is container-query based (`@container` root, `@3xl/@4xl/@5xl` inside sections). Responsive work must extend this system (add/adjust container breakpoint usage inside sections), never bolt on fixed-viewport media queries for layout.
- No horizontal overflow at any width: verify generated CSS adds no untranslatable width; every hero/split/grid uses logical utilities; check AR (RTL) overflow specifically (a layout that fits LTR can overflow RTL).
- Interaction states: hover/active/focus-visible from the audit; `:focus-visible` outline uses the existing mono ring token.
- `preview.svg` files (10) are hand-authored wireframe thumbnails the marketing/dashboard cards show. Refresh them to reflect each new family (surface light/deep, heading serif/sans vibe, accent color, hero style) while keeping the exact file paths and the same nominal aspect (they render in `aspect-[4/5]` thumbnails today). Keep them lightweight SVGs (simple geometric silhouettes — no bitmap embeds).
- Build rule + verification surface per earlier milestones.
- The final `quality-review.md` is the epic's closing artifact and must be honest: state clearly what meets the quality bar, what still needs a human visual pass, and any deferred items.