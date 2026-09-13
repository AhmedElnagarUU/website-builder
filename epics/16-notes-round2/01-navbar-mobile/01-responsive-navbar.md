# Task — Responsive Navbar With Mobile Menu

## Title
Make the app navbar usable on mobile: collapse the action cluster into a hamburger-opened dropdown under `md`, keep the desktop layout exactly as-is above `md`.

## Context
On narrow viewports the signed-in cluster (PlanBadge + Upgrade + Dashboard + Sign out + LanguageSwitcher, all `whitespace-nowrap text-lg` pills in a `justify-between` flex with no wrap) overflows/clips. Fix it without touching layout props or the served pages.

## Scope
Edit `src/features/shell/components/Navbar.tsx`:
1. **Desktop cluster**: add `hidden md:flex` to the right cluster div (`flex items-center gap-2`).
2. **Hamburger button**: `"use client"` state (`useState`). A `md:hidden` button next to where the right cluster sits: a mono-display bordered pill with an inline hamburger SVG (three lines) that flips to ✕ when open — no icon package. Label/aria via `nav.menu` (open) / `nav.close` (closed-but-pressed state: announce via the button's content so screen readers get context).
3. **Mobile dropdown**: rendered when `open` and `md:hidden` (a full-width panel directly under the `<header>`, `absolute`/`relative` within the header so it doesn't shift layout; bg `bg-paper-2`, `border-b-2 border-ink`, px-4 py-3, vertical stack of the SAME items as the desktop cluster in the same order + the landing anchors when `isLanding`). Each item calls `setOpen(false)` on click (and route-safe: use the same `<a>` hrefs as desktop). Reuse existing label keys; reuse `landing.nav.*` for landing anchors.
4. **Close behaviour**: clicking an item, pressing Escape, or clicking the backdrop/outside closes it. Add a `useEffect` keydown listener while open (mirror the pattern in `DeleteSiteButton.tsx`) and a transparent full-width overlay or `onMouseLeave`… keep KISS: an onClick on an invisible fixed overlay (`fixed inset-0 z-40` behind the panel, `z-50` panel) is the simplest RTL-safe approach.
5. **Layout safety**: add `min-w-0`/`truncate` to the logo link so the brand can shrink on very narrow screens; keep everything else identical.

## Dependencies
CODE_RULES.md; `src/messages/en.json`/`ar.json` (add `nav.menu`/`nav.close`); `DeleteSiteButton.tsx` as the keydown/Escape pattern reference.

## Out of scope
Changing the landing `hidden md:flex` desktop anchors; changing `LanguageSwitcher` internals (just render the existing component in the dropdown); the rendered-site header (`src/shared/site-render/sections/HeaderSection.tsx`) which already has its own menu.

## Acceptance criteria
1. At ≤767px (En + Ar): logo + hamburger only; tapping opens a stacked menu containing every desktop-cluster item (and landing anchors on the landing page); each works when clicked; Escape + overlay-click close it.
2. At ≥768px: byte-for-byte the previous desktop layout (right cluster visible, no hamburger).
3. No horizontal overflow on a 320px viewport in either locale; RTL uses logical props only.
4. `nav.menu`/`nav.close` present in both message files (Arabic verbatim); `tsc --noEmit` + `npm run lint` pass.