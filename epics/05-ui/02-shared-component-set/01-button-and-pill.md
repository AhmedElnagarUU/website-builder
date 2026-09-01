# Task 01 — Shared button & pill component (Vexo)

## Context

The landing page's `.btn` / `.btn-primary` are its most reused interaction pattern: a hand-written pill button that inverts on hover, and a red-filled primary that deepens on hover. The product needs one shared button primitive so auth, wizard, and editor CTA/actions share the exact same language instead of each screen reimplementing its own.

## Scope

- A single `shared/ui` Button (works as `<button>` or `<a>`) implementing the source's pill styling + variants (default/primary, plus a ghost/text variant for quiet secondary actions that the source's `nav-links`/quiet text implies).
- Restyle any existing `shared/ui` button usage so all current screens keep identical props but pick up the new look.
- Focus-visible ring and reduced-motion from M01 base.

## Technical details

Files (adapt to existing `shared/ui` layout established in Epic 01):

```
src/shared/ui/Button.tsx               // button primitive (variant, size, asChild/as)
src/shared/ui/button.css (or tailwind util)  // styling via M01 tokens
```

Design mapping (bind to source):
- Base pill: `rounded-[999px]`, `border-2 border-ink`, `px-5 py-2.5`, Caveat/600 font, inline-flex gap-2, transition.
- Variant `primary`: `bg-vexa-red text-paper border-vexa-red`, hover → `bg-ink border-ink text-paper`.
- Variant `default` (secondary): transparent bg, `text-ink`, hover → `bg-ink text-paper`.
- Variant `ghost`/`quiet`: no border, ink text, red hover text (mirrors `nav-links a:hover`).
- `:focus-visible` → `outline-2 outline-red outline-offset-3` (from base layer), reduced-motion handled globally.

Props/signature must stay API-compatible with the existing Button so changing it doesn't ripple into behavioral changes in Epic 01–04 screens; this task only swaps styling/class application.

## Dependencies

- `epics/05-ui/01-design-tokens-foundation/01-extract-design-tokens.md` and `02-...-typography.md` (M01 done).
- Existing `shared/ui/Button` from Epic 01 (to restyle in place).

## Out of scope

- New component types (cards, tags, heads = other tasks in this milestone).
- Changing button behavior, event handling, or call sites' semantics.

## Acceptance criteria

- [ ] `Button` (and any `<a>` variant) renders pill with ink border and Caveat label on both `en` and `ar`; Arabic uses the AR stack (never Caveat).
- [ ] Hover on default inverts to ink fill; primary deepens to ink; hover + focus states are visible.
- [ ] Every screen that already used a Button looks consistent after this change; no screen's click behavior changed.
- [ ] RTL: arrow/glyph suffixes flip (`rtl:rotate-180`) where directional; spacing via logical `gap`/padding.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; single shared Button in `shared/ui`; token-driven classes; no hardcoded strings/colors; no new deps; RTL-safe.
