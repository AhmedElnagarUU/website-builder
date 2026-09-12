# Task — Upgrade Entry in the Navbar

## Title
Add an "Upgrade" link to the navbar, shown to signed-in users who are not already on the Pro plan, pointing at the pricing page.

## Context
The navbar already shows the current plan via `PlanBadge` but offers no path forward. The owner's note: "the user can upgrade his plan from navbar … add upgrade plan." Lift, no layout-side subscription changes.

## Scope
- In `src/features/shell/components/Navbar.tsx`, next to `PlanBadge` (line 62), render an "Upgrade" entry when `isSignedIn && planId !== "pro"` (treat `null` as free).
- Style it to read as the primary action: a filled `border-2 border-ink bg-ink text-paper` rounded-full label on the same visual level as the other navbar links (mono-display, `rounded-full px-4 py-1 text-lg leading-none`).
- `href={`/${locale}/pricing`}` using the same `<a>` pattern the navbar already uses (do not switch this file to `next/link`).
- Do not touch `PlanBadge`, the layout, or the signed-out branch.

## Dependencies
CODE_RULES.md; `src/app/[locale]/layout.tsx` (planId plumbing — read-only).

## Out of scope
The pricing page itself (task 02). Any plan/limit logic. Changing `PlanBadge`.

## Acceptance criteria
1. Signed-in Free (or unresolved) users see the **Upgrade** button in the navbar beside the plan badge; Pro users and signed-out visitors do not.
2. Clicking navigates to `/{locale}/pricing` in both locales.
3. The label comes from `nav.upgrade` (EN/AR); `tsc --noEmit` + `npm run lint` pass.