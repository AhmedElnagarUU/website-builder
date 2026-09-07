# Task — Green/red live-status indicator

## Title
Add a green "live" / red "not live" indicator to the editor header

## Context
Owners need to know at a glance whether their site is currently live. Since publishing and editing are separate actions and the live URL only ever serves the last explicit snapshot, the editor should clearly show the current live/draft state.

## Scope
Add a compact status indicator to the editor top bar: a green pulsing dot + "Live" when published, a red dot + "Not live" when draft/unpublished. Include a short tooltip/text clarifying that the live URL serves the last published version (so an owner understands edits since publish are not yet live).

## Technical details
- File: `src/features/editor/components/EditorShell.tsx` header, near `PublishControl`. Add a thin component (e.g. `src/features/editor/components/LiveStatusIndicator.tsx`).
- Inputs: `status: SiteStatus` and `publishedSnapshot: PublishedSnapshot | null` (already available in `EditorShell`).
- New i18n keys: `editor.live.live`, `editor.live.not_live`, and a hint string describing "edits since last publish aren't live yet" — in `en.json`/`ar.json`.
- Style it with the existing monomastic design tokens (green `mono-green`, red `mono-red`). Must be unmistakable at a glance.
- The green/red reflects the LIVE state only; do not turn green based on unpublished edits (those are covered by the existing drift indicator).

## Dependencies
- Epic 06 publish/unpublish (already complete).

## Out of scope
- Analytics (Epic 10), template picker (Epic 09). Historical/last-published-time display if not already present.

## Acceptance criteria
- A published site shows the green Live indicator; an unpublished/draft site shows the red Not-live indicator.
- After publishing, the indicator turns green without a full reload (or via the existing re-render path).
- After unpublish, it turns red.
- Label + tooltip text renders correctly in EN and AR (RTL).
- Unpublished edits do NOT turn it green when the site was previously not live.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
