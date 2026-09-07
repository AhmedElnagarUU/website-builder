# Task — Style Data Model, Tokens & Site Utilities

## Title
Add the per-template `TemplateTheme` to the style data model, plumb it through context and tokens, and add RTL-correct site typography/surface utilities.

## Context
Today a template differs visually only by `defaultAccent`, `radius`, `imagery`, `fontPair`, and every content section renders the same skeleton. This task adds a second, deliberate per-template axis — the theme (family, surface, heading face, hero variant, accent role) — as **data**, so sections (M03/M04) can branch on it and each template gets its own design language without per-template code. It also fixes the type gap: site pages currently render in Tailwind's default `font-serif`/`font-sans` and don't use the app display faces, and heading families ignore the Arabic swap.

## Scope
- `src/features/templates/types.ts`: add `TemplateTheme` interface; add `theme: TemplateTheme` to `TemplateStyle`; export it.
- `src/features/templates/catalog.ts`: give each of the 10 templates its `theme` per the M01 binding table (inside the existing per-template `style` object). Keep `fontPair`/`radius`/`imagery` values as they are today.
- `src/shared/site-render/context.ts`: widen `SiteStyleContext` value to the full `TemplateStyle` (defaults safe for stand-alone use).
- `src/shared/site-render/tokens.ts`: map theme → body class + heading class + surface class (KISS helpers, e.g. `siteBodyClass(style)`, `siteHeadingClass(style)`, `siteSurfaceClass(style)`); keep existing `RADIUS_CLASSES`/`CARD_RADIUS`/`CARD_SHADOW` behavior.
- `src/shared/site-render/SiteRenderer.tsx`: on the root element, additionally apply `.site-body` and, when `surface === "deep"`, `.site-surface-deep`. No other changes to the file.
- `src/app/globals.css`: add the additive utilities `site-heading-serif`, `site-heading-sans`, `site-body`, `site-surface-deep` (deep palette hexes chosen per the audit), with `:lang(ar)` overrides per MILESTONE.md.

## Technical details
- Follow the exact theme model + typography/surface utility spec and hex guidance in `02/MILESTONE.md` "Shared context". Assignment table comes from `01-design-audit/01-audit-and-research.md` (the binding table is restated in that file; the audit report explains justifications).
- Do NOT touch `F`, `SlotImage`, `SampleTag`, `SectionRenderProps`, the section→component mapping, or edit-mode plumbing. Do NOT change any section component in this task (they consume the new fields in M03/M04).
- `fontPair` (existing) still controls radius-ish body base; keep `FONT_FAMILIES` for backward-compat but prefer `.site-body` going forward — verify nothing breaks.
- RTL: no directional utilities; `surface` override must not affect the editor chrome or the preview toolbar (it is scoped to the SiteRenderer subtree).

## Dependencies
- M01 `audit-report.md` (theme assignments + palette direction). CODE_RULES.md.
- Build rule per MILESTONE.md.

## Out of scope
- Any section component redesign (M03/M04). Reusable component primitives (02). Content changes. `preview.svg`. New images. New dependencies.

## Acceptance criteria
1. `npm run lint` and `npx tsc --noEmit` pass.
2. `npm run build` passes (build rule followed); `/preview/classic-services` and `/preview/visual-showcase` render 200 and carry the new font classes on rendered headings/bodies.
3. All 10 catalog entries have the correct `theme` (spot-check via `grep '"theme"'` count = 10 and values match the binding table).
4. A deep-surface template (e.g. `visual-showcase`) and a light one (e.g. `classic-services`) both render with `bg-background` background matching their surface (verified in built HTML: deep root has `site-surface-deep` class).
5. No build-time warnings for the new utilities; no CSS/class name collisions with existing app classes (`.mono-*`, `.site-*` names do not overlap existing utilities).

## Definition of Done
- CODE_RULES.md §1–§8 followed (no new deps; logical props; validation passes; build rule respected).
- `npx tsc --noEmit` → exit 0; `npm run lint` → clean; `npm run build` → success with the dev/port/build rule honored; `/api/health` ok after dev restart.