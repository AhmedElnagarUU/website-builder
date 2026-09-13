# Milestone 01 — Responsive App Navbar

## Goal
The app navbar works on mobile: below the `md` breakpoint the always-visible right cluster (plan badge, upgrade, dashboard, sign out, sign-in/sign-up, language switcher) collapses behind a hamburger menu, and all items stay reachable — no overflow, no clipping, RTL-safe.

## Tasks (execution order)
1. **01-responsive-navbar.md** — Implement the responsive behavior + mobile dropdown in `Navbar.tsx`.

## Shared context (binding for this milestone)
- File: `src/features/shell/components/Navbar.tsx` (`"use client"`). Mounted by `src/app/[locale]/layout.tsx` with `{ isSignedIn, planId, locale }`. Do not change props or the layout.
- Current structure: `<header className="border-b-2 border-ink bg-paper-2/80"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">` with (a) logo (never hidden), (b) landing anchors cluster (`hidden md:flex`, keep as-is), (c) right cluster (`flex items-center gap-2` — no responsive class).
- The right cluster must be `hidden md:flex` on mobile; the hamburger is `md:hidden`. The dropdown renders only when open and only below `md` (`md:hidden` on the panel, or close on route change).
- Landing anchors are **also** duplicated into the mobile dropdown when `isLanding` (a mobile landing visitor already lost them via `hidden md:flex`).
- Language switcher appears in the dropdown too on mobile (it's part of the right cluster).
- All labels from messages (see new keys) — no literals.

## New message keys (both `en.json` + `ar.json`)
```json
"nav": {
  "menu": "Menu",
  ...
}
```
- `nav.menu` — **en** `Menu` | **ar** `القائمة` (aria-label for the hamburger button; also its visible label or `title`).
- `nav.close` — **en** `Close` | **ar** `إغلاق` (aria-label when the menu is open; or reuse `nav.menu` if you keep one label — your choice, but the open/close states must be announced distinctly).

## Verification (end of milestone)
`/en` and `/ar` on a ~375px viewport show logo + hamburger only; opening the menu lists every nav action (landing anchors when on landing; plan/upgrade/dashboard/sign-out or sign-in/sign-up; language switcher); all items clickable; Escape/outside-click closes; ≥768px shows the exact current desktop layout (no regression); `tsc --noEmit` + `npm run lint` pass.