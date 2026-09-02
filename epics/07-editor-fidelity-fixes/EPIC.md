# Epic 07 — Editor & Site-Fidelity Fixes

## Purpose (one line)
Fix the concrete visual-fidelity bugs that make the editor misrepresent the published site and hurt mobile usability: transparent template background, broken mobile preview scaling, desktop-only navbar that never collapses on mobile, and no live/not-live status feedback in the editor.

## Why this epic matters
The user must trust that what they see in the editor is exactly what visitors get after publish. Right now the editor shows a template with a transparent-looking background (mismatching publish), the mobile preview breaks, and there is no signal about whether the site is currently live. These are blockers to a believable product and are cheap to fix before layering bigger features on top.

## Scope boundaries
**In:**
- Root render wrapper background so the template reads as solid (matches published look) in both editor and live.
- Mobile/tablet device preview in the editor renders correctly (no breakage).
- Navbar collapses into a working mobile menu on small screens in both the live site and editor preview.
- Green/red live-status indicator in the editor header.

**Out (handled elsewhere):**
- Multi-page template model → Epic 08.
- Template picker / gallery redesign → Epic 09.
- Analytics → Epic 10.
- The S3 upload backend defect — deliberately deferred (see AGENTS.md note); this epic only touches editor/local rendering, not S3.

## Milestones (in order)
1. **01-editor-visual-fidelity** — solid template background + correct mobile/tablet preview rendering.
2. **02-reusable-navbar-mobile** — responsive navbar with a working mobile menu, shared by live site and editor preview.
3. **03-live-status-indicator** — green/red live-state dot in the editor header.

## Cross-epic dependencies
- Depends on Epic 06 (Publishing) being complete — the live indicator reads `status`/`publishedSnapshot`.
- Should complete before Epics 08–10 so the fidelity baseline is solid.
