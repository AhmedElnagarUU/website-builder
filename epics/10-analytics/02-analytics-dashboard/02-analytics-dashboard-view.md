# Task — Analytics dashboard view

## Title
Render per-site analytics on the dashboard surface (totals, per page, trend)

## Context
Owners want to know how many visits their published sites get. The dashboard should surface this per site, in the product's visual style, bilingual, with an honest "pageviews, not unique visitors" note.

## Scope
A dashboard section (per site card or a dedicated panel) showing: total pageviews, last-7 and last-30 totals, a per-page breakdown (page label + locale + views), and a sparkline/bar trend of the last 30 days. Handle the empty state (no published traffic yet).

## Technical details
- Files: dashboard page `src/app/[locale]/dashboard/page.tsx` (+ components `src/features/dashboard/components/` e.g. `SiteAnalyticsPanel.tsx`), reusing M02 task 01's read path (server-side render preferred; a client fetch fallback via the API route is acceptable for refresh).
- Resolve page slug → localized page label via `getTemplate(site.templateId).pages` (Epic 08).
- Small no-dependency bar/sparkline with divs (no chart lib — no new deps).
- New i18n keys: `analytics.*` (total_views, last_7_days, last_30_days, per_page, trend, empty, note_pageviews_not_visitors) in `en.json` + `ar.json`, RTL-safe.
- Follow the monomastic design tokens.

## Dependencies
- M02 task 01. Epic 08 (page labels). Epic 06 (published sites).

## Out of scope
- Unique visitors/sessions; third-party analytics; export.

## Acceptance criteria
- A site with recorded views shows totals + per-page (page label + locale) + 30-day trend in the dashboard; empty state for zero views.
- Only the owner's sites render; RTL correct in Arabic.
- Copy notes these are pageview counts, not unique visitors.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; no chart library.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.