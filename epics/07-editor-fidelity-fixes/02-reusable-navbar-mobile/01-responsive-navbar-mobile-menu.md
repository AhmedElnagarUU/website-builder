# Task — Navbar collapses into a working mobile menu

## Title
Make the site navbar become a functional hamburger mobile menu on small screens

## Context
On mobile the existing horizontal navbar (`HeaderSection`) does not transform into a mobile menu — links overflow/misalign, giving a broken look on phones both in the editor preview and the published site.

## Scope
Implement a responsive navbar: a horizontal desktop/top nav on `md:` and up, and a hamburger menu that opens a collapsible panel with the same links below that breakpoint. It must work in BOTH the editor preview (editMode) and the live published site (single shared component).

## Technical details
- File: `src/shared/site-render/sections/HeaderSection.tsx`. Use a client-state hamburger toggle (the section is part of the client `SiteRenderer` tree, so hooks are fine).
- Keep nav link labels sourced from the existing content fields (`nav_home`, `nav_services`, `nav_about`, `nav_contact`) — do not hardcode.
- Menu open/close and aria-label strings are new i18n keys (`editor.nav.open`, `editor.nav.close`, `editor.nav.menu`, …) in both `en.json` and `ar.json`; RTL must render correctly (panel alignment flips in Arabic).
- Respect the brand color / header styles already produced by the template section.
- Must not add any drag-and-drop or structural editing affordances (permanent invariant).

## Dependencies
- Epic 07 Milestone 01 tasks (opaque + mobile-safe layout) to avoid visual regressions.

## Out of scope
- In-app product Navbar (`src/app/[locale]/...` chrome) — that's separate from the site `HeaderSection` and is out of scope.
- Rearranging which nav links exist (Epic 08 multi-page changes nav routing).

## Acceptance criteria
- On a phone-width viewport the navbar shows a hamburger; tapping opens a menu listing the same nav labels; tapping a link or the close control closes it.
- On desktop the horizontal nav is unchanged.
- Works identically in editor mobile preview and the published live site.
- EN and AR both correct; no horizontal overflow.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- `npx tsc --noEmit` passes; ESLint clean. Build verified per build rule.
