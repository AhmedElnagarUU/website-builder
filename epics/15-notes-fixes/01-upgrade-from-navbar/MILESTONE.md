# Milestone 01 — Upgrade From Navbar

## Goal
Signed-in users on the Free plan can see an "Upgrade" entry in the navbar next to the current-plan badge, and it leads to a public pricing page that honestly shows what Free vs Pro includes and what happens next (payments open soon).

## Tasks (execution order)
1. **01-upgrade-navbar-entry.md** — Add the "Upgrade" link to the navbar for signed-in users who are not on Pro.
2. **02-pricing-page.md** — Create the public `/[locale]/pricing` page (Free vs Pro comparison + current-plan marker + coming-soon CTA).

## Shared context (binding for this milestone)
- The navbar is `src/features/shell/components/Navbar.tsx` (a client component). It already receives `isSignedIn: boolean` and `planId: PlanId | null` from `src/app/[locale]/layout.tsx` — do not change the layout's signature or the subscription resolution. `PlanId = "free" | "pro"`.
- There is no payment provider, no checkout, and adding one requires a new dependency + owner approval. The upgrade story ends at "payments open soon" — honest, not fake.
- Plan facts (source of truth `src/features/monetization/plans.ts`): FREE = 1 site, up to 4 pages, 1 language, 2 AI generations/day, no custom domain. PRO = up to 10 sites, up to 50 pages, 2 languages, 50 AI generations/day, custom domain. Do NOT refactor `plans.ts`; the pricing page renders the feature lists from the new `pricing.*` message keys below.
- Messages: add to **both** `en.json` and `ar.json`. Arabic verbatim below.
- New page pattern reference: `src/app/[locale]/dashboard/page.tsx` (server component, `setRequestLocale(locale)`, `getTranslations`). The pricing page must also work for **signed-out** visitors (footer links to it).

## New message keys
`nav.upgrade` (en: `Upgrade` | ar: `الترقية`)

```json
"pricing": {
  "title": "Pick your plan",
  "subtitle": "Start free. Upgrade when your business grows.",
  "current_badge": "Your current plan",
  "free_title": "Free",
  "pro_title": "Pro",
  "features_free": [
    "1 website",
    "Up to 4 pages",
    "1 language",
    "2 AI generations per day"
  ],
  "features_pro": [
    "Up to 10 websites",
    "Up to 50 pages",
    "2 languages (Arabic + English)",
    "50 AI generations per day",
    "Custom domain"
  ],
  "choose_pro": "Upgrade to Pro",
  "coming_soon": "Payments open soon — check back shortly for upgrade options."
}
```
AR values (verbatim):
```json
"pricing": {
  "title": "اختر خطتك",
  "subtitle": "ابدأ مجانًا، ورقِّ خطتك عندما ينمو نشاطك التجاري.",
  "current_badge": "خطتك الحالية",
  "free_title": "المجانية",
  "pro_title": "برو",
  "features_free": [
    "موقع واحد",
    "حتى 4 صفحات",
    "لغة واحدة",
    "مولّدَان من الذكاء الاصطناعي يوميًا"
  ],
  "features_pro": [
    "حتى 10 مواقع",
    "حتى 50 صفحة",
    "لغتان (العربية والإنجليزية)",
    "50 مولّدًا من الذكاء الاصطناعي يوميًا",
    "نطاق مخصص"
  ],
  "choose_pro": "الترقية إلى برو",
  "coming_soon": "الدفع سيتوفر قريبًا — عُد لاحقًا للاطلاع على خيارات الترقية."
}
```
Note: `features_free`/`features_pro` are arrays — render them via `t.raw("pricing.features_free")` (next-intl array access) or `Object.entries(t.raw(...))`. Never hardcode the strings.

## Verification (end of milestone)
`npx tsc --noEmit` and `npm run lint` pass; pricing page builds and renders in both locales; navbar shows **Upgrade** only when signed in and not on Pro.