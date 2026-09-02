# Milestone 02 — Reusable Responsive Navbar with Mobile Menu

## Goal
Provide a navbar that collapses into a working mobile menu on small screens, shared so the same behavior appears in the editor preview and the live site.

## Shared context
- The published site header is rendered by `HeaderSection` (`src/shared/site-render/sections/HeaderSection.tsx`) and it currently renders nav links in a horizontal row that breaks or wraps badly on mobile instead of becoming a menu.
- The editor preview reuses this same `HeaderSection` (via `SiteRenderer`), so fixing it once fixes both editor and live.
- i18n: nav link labels come from content fields; the menu-open/close chrome and any aria labels are new user-facing strings → must be in `en.json`/`ar.json`.

## Tasks
1. **01-responsive-navbar-mobile-menu** — split the nav into a desktop row + a collapsible mobile menu with a hamburger toggle, used by `HeaderSection` in both edit and live modes.
