# Task — Admin area shell

## Title
Create the protected admin area with its own shell and navigation

## Context
Admin features need a governed home: a route that only admins can enter, with its own navigation (Overview, Users, Billing) and consistent styling, separate from the customer-facing app.

## Scope
Add the admin route(s), an admin-only guard on entry, and an admin shell (layout + nav) hosting the milestone pages.

## Technical details
- Files: `src/app/[locale]/admin/layout.tsx` (admin shell + `requireAdmin`) and `src/app/[locale]/admin/page.tsx` (Overview placeholder to be filled in M02/M03) plus a `src/features/admin/components/AdminNav.tsx`.
- Guard: the admin layout calls `requireAdmin(locale)` (non-admin → redirect to `/dashboard` or a 403 page; unauth → sign-in).
- Shell: admin brand, nav links (Overview, Users, Billing), logout/customer-site link; vexa tokens; bilingual EN + AR (RTL-safe). New i18n keys under `admin.*` in `en.json`/`ar.json`.
- Do not place admin links in the public user Navbar (keep it separate; optionally a subtle link only for admins).

## Dependencies
- M01 task 01 (role + guard).

## Out of scope
- Overview metrics / user table / billing UI — those are M02/M03 (this task is the shell + placeholder route).

## Acceptance criteria
- `/admin` (and nested) is only reachable by an admin; non-admin redirects; unauth → sign-in.
- Admin shell renders with working nav + locale switching; EN and AR correct.
- Placeholder Overview page renders.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; admin area gated correctly.
