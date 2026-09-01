# Task 01 — Brand color customization (palette + endpoint + control)

A single-task milestone. The brand color is already a first-class site field (`Site.brandColor`, defaulted to the template's `defaultAccent` at generation) and is applied by the renderer via the `--brand` CSS variable with auto black/white text (Milestone 01). This task adds the constrained way for the user to change it.

## Context

Per PRD 12.2, visual customization is deliberately limited: the accent/brand color comes from a curated palette whose members all meet contrast/readability against the fixed layout. There is no free-form color picker in the MVP.

## Scope

- A fixed, curated accent `PALETTE` of safe brand colors (each at a darkness that guarantees `textOnBrand` contrast ≥ 4.5:1 on white, and brand-on-white links readable).
- Owner-only endpoint to set `site.brandColor` to a palette member.
- An editor control (popover/swatch row) that shows the current color plus palette members and saves on selection.

## Technical details

Files:

```
src/shared/lib/brand-palette.ts                  // PALETTE + containsBrandColor(hex)
src/app/api/sites/[siteId]/brand-color/route.ts  // thin PATCH handler
src/features/sites/api/update-brand-color.ts     // logic
src/features/editor/components/BrandColorControl.tsx  // swatch row in editor chrome
```

PALETTE (fixed; starting set, all chosen to pass contrast — adjust values only within safe range):
`#1E40AF` (blue), `#0F172A` (slate), `#B45309` (amber-700), `#7C2D12` (brown-800), `#15803D` (green-700), `#0E7490` (cyan-700), `#4338CA` (indigo-700), `#7C3AED` (violet-600), `#DB2777` (pink-600), `#1F2937` (gray-800).

PATCH semantics (`/api/sites/:id/brand-color`, body `{ color }`):
- Session/ownership (`401`/`404`).
- `color` must be a lowercase hex present in `PALETTE` → else `422 { error:'invalid_color' }` (never accept arbitrary hex in MVP).
- Sets `brandColor`, applies `hasUnpublishedChanges` rule, returns `200` DTO.

Control (`BrandColorControl`, client):
- Renders current swatch + the palette; selecting a color PATCHes and immediately recolors the preview via the live `contentByLocale`/props re-render.
- Appears in the EditorShell top bar (right-side reserved action area from Milestone 01 Task 02).
- Strings under `editor.color.*`.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `editor.color.label` | `Accent color` | `لون التمييز` |

## Dependencies

- `epics/04-preview-and-edit/01-site-render/01-template-renderer-engine.md` (renderer applies `brandColor`, `textOnBrand`).
- `epics/02-site-creation-flow/01-site-data-model/MILESTONE.md` (site model, ownership, hasUnpublishedChanges rule).

## Out of scope

- Free-form color picker / arbitrary hex (V1.1).
- Per-template palette curation beyond the fixed shared set.
- Image/other visual controls (own milestones).

## Acceptance criteria

- [ ] Anonymous PATCH → `401`; non-owner → `404`.
- [ ] `{ color:'#15803D' }` → DTO `brandColor === '#15803D'`, preview recolors immediately (buttons/accent change).
- [ ] `{ color:'#123456' }` (not in palette) → `422 { error:'invalid_color' }`; color unchanged.
- [ ] Every non-white text color always reads automatically (black/white) and passes contrast — verified by eye on a brand-colored button.
- [ ] The control shows the current color selected and applies a selection in both locales.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; palette lives in `shared/` (rendered + validated by two features); no hardcoded strings; no new dependencies.
