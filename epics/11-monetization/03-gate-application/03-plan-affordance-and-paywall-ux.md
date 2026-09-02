# Task — Plan affordance and paywall UX

## Title
Show a "Current plan" notice and bilingual paywall prompts when a limit is hit

## Context
Users need to know their plan and why an action is blocked. This adds a minimal, elegant surface: a current-plan indicator in the app chrome and paywall prompts on the guarded actions (this is the UX slice of gating; the real checkout/upgrade page + gateway come later).

## Scope
A small "Current plan" affordance and a reusable bilingual paywall/upgrade prompt component wired to the standard paywall error shape.

## Technical details
- Files: `src/features/monetization/components/PlanBadge.tsx` (nav/header/badge showing Free/Pro; for authenticated users only) and `PaywallPrompt.tsx` (modal rendering on 402/403 with `limitKey` → human message + upgrade note).
- Wire the shell `Navbar` (`src/features/shell/components/Navbar.tsx`) to show the plan badge when signed in.
- Add i18n keys under `plan.*` / `paywall.*` in `en.json`/`ar.json` (current_plan, free, pro, limit_reached, requires_upgrade, account_frozen, account_suspended, upgrade_hint).
- RTL-safe; vexa tokens.
- Optimistic: on a 402/403 response in guarded actions (create site, publish, change language, regenerate, image upload), show the PaywallPrompt with the returned `limitKey`.
- No checkout/upgrade flow yet — the prompt just explains and points "coming soon" (or to the future upgrade surface).

## Dependencies
- M03 tasks 01 & 02 (guards emit the errors). Epic 05 (nav/chrome).

## Out of scope
- Real upgrade/checkout page, payment gateway, price display gone live — future epic.

## Acceptance criteria
- Signed-in user sees their current plan badge (Free/Pro) in the nav (EN/AR correct).
- Hitting a guarded limit shows a bilingual paywall prompt with the right `limitKey` message and an upgrade hint.
- Frozen/suspended shows the appropriate account-status message, not a generic error.
- RTL and mobile correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; manual UX pass EN + AR.
