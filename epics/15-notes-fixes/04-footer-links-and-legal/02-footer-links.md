# Task — Fix Footer Links

## Title
Rewire every dead footer link in `src/features/shell/components/Footer.tsx` to a working full-path target (the two legal pages from task 01 plus landing anchors and the pricing page).

## Context
8 of 11 footer links are `href="#"`; the other two (`#how`, `#features`) only work on the landing page. Relative anchors break on every other route. The fix is to use locale-full paths so the browser navigates to the landing page (or pricing/legal pages) first, then lands on the anchor where relevant.

## Scope
In `src/features/shell/components/Footer.tsx` (keep the `<a>` markup style, `useTranslations`, and `year` line as-is; only change `href` values):
- `product_links.how` → `/${locale}/#how`
- `product_links.what` → `/${locale}/#features`
- `product_links.pricing` → `/${locale}/pricing`
- `owners_links.restaurants` → `/${locale}/#features`
- `owners_links.retail` → `/${locale}/#features`
- `owners_links.bilingual` → `/${locale}/#languages`
- `company_links.about` → `/${locale}`
- `company_links.privacy` → `/${locale}/privacy`
- `company_links.terms` → `/${locale}/terms`
- The footer must receive the current locale: make `Footer` accept a `locale: string` prop (read it from `params` in `src/app/[locale]/layout.tsx`, which already resolves the locale) and pass it where the footer is rendered (`layout.tsx:50`). Keep the component otherwise unchanged.

## Dependencies
CODE_RULES.md; task 01 (`pricing`/`privacy`/`terms` pages are targets and must exist before this task is verified).

## Out of scope
The published-site footer (`src/shared/site-render/sections/FooterSection.tsx`). Adding an "About" page. Changing footer content/copy.

## Acceptance criteria
1. From any page (e.g. `/en/dashboard`), every footer link navigates successfully: anchors jump to the landing section, `pricing` → `/en/pricing`, `privacy` → `/en/privacy`, `terms` → `/en/terms`, `about` → home.
2. Same in Arabic (`/ar/...` prefixes).
3. No `href="#"` remains in `Footer.tsx`; `tsc --noEmit` + `npm run lint` pass.