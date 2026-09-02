# Task — Real visual template thumbnails

## Title
Render a true visual preview thumbnail for each template in the gallery

## Context
A gallery of plain names is not a gallery. Each template card needs a real visual preview reflecting the actual template (with the Epic 08 real default images), so the owner sees what they'll get before choosing.

## Scope
Produce a rendered thumbnail per template in the gallery and the picker. Prefer a static, server-rendered preview (deterministic, no client runtime cost) if feasible, otherwise a lightweight non-interactive scaled render.

## Technical details
- Leverage `SiteRenderer` (non-interactive: `editMode={false}`, no edit callbacks) inside a scale-down container of fixed thumb aspect ratio, or a dedicated static preview (e.g. prerendered screenshot-like markup) if SSR of the full renderer is too heavy. Decide and document the approach in the task's implementation.
- Thumbnails must use the template's default/real images and defaultAccent so preview = actual result.
- Keep thumbnails cheap: cache where possible; deterministic per template + locale.
- RTL thumbnails correct in Arabic.

## Dependencies
- M01 task 01; Epic 08 (real images + pages) and Epic 07 (solid background) so the preview is faithful.

## Out of scope
- Interactive editing inside previews. Editor picker (M02) can reuse this thumb component.

## Acceptance criteria
- Each gallery card shows a faithful visual thumbnail of its template using real images and its accent.
- Thumbnails load reasonably fast and reuse without runtime dependency.
- EN and AR thumbnails both correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.