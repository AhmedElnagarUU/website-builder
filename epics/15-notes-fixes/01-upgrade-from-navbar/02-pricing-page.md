# Task — Public Pricing Page

## Title
Create `/[locale]/pricing`: a public Free-vs-Pro comparison page with a current-plan marker and a coming-soon upgrade CTA.

## Context
There is no destination for the navbar's Upgrade entry and no pricing surface anywhere in the app. This page is informational only — real upgrades/payments are explicitly out of scope for this epic.

## Scope
- New route `src/app/[locale]/pricing/page.tsx`, a server component following the pattern of `dashboard/page.tsx`: `setRequestLocale(locale)`, `getTranslations("pricing")`. No `generateStaticParams` needed (the `[locale]/layout.tsx` handles it).
- **Two plan cards** (Free / Pro) in a responsive grid, matching the app aesthetic (`mono-container`, `mono-display` headings, `rounded-[4px] border-[1.5px] border-ink bg-paper-2 shadow-mono` cards). Each card: plan title (`pricing.free_title`/`pro_title`), the feature list rendered from `pricing.features_free`/`features_pro` (array — must render via `t.raw(...)`, e.g. as a bulleted `<ul>` with mono check marks; never hardcode), and a CTA.
- **Current-plan marker**: fetch the session exactly like the layout does (`getSession()` from `@/features/auth/lib/session`; if present, `resolveSubscriptionForUser(session.user.id)` from the monetization repository). If signed in and the resolved `planId` matches a card, show a `pricing.current_badge` tag on that card and its CTA becomes a disabled state (their plan). If signed out, show no badge.
- **Pro CTA**: a tiny `"use client"` button (`src/features/monetization/components/PricingCta.tsx`) labeled `pricing.choose_pro`; on click it toggles a short `pricing.coming_soon` notice beneath itself. Reuse for both cards where sensible (Free card links to `/{locale}/auth/sign-up` for guests, or shows current badge). Keep it KISS — no modals, no async calls.
- Header: `pricing.title` + `pricing.subtitle` (match the dashboard header pattern: mono-display, `text-5xl` title, bordered by the section).

## Dependencies
Task 01 (navbar entry) for linkage; CODE_RULES.md.

## Out of scope
Payment provider/checkout/plan mutation; API changes; auth changes; refactoring `plans.ts`.

## Acceptance criteria
1. `/en/pricing` and `/ar/pricing` render (200), RTL-correct, reachable for signed-out users.
2. Feature lists match the `plans.ts` facts and render from message arrays in both locales (verify AR list shows Arabic items).
3. Signed-in Free user sees "Your current plan" on the Free card; a Pro subscription marks the Pro card.
4. The Pro CTA reveals the coming-soon notice on click; no dead links, no hardcoded strings.
5. `tsc --noEmit` + `npm run lint` pass.