# Epic 15 — Notes-Fixes: Plans, Safety, Labels, Legal, and Admin Handoff

## Purpose (one line)
Ship the five user-requested change items in `docs/06-notes/03-need-to-change.md`: (1) an "Upgrade" entry next to the current-plan badge in the navbar plus a pricing page; (2) deleting a website requires a typed-name confirmation dialog; (3) in-app language labels become the codes "ar"/"en"; (4) every app-footer link points somewhere real and privacy/terms pages are created; (5) the super-admin dashboard is removed from this application (it moves to a separate future app).

## Why this epic matters
Each item is a direct product request from the owner's notes file. They are independent but grouped into one epic so a single agent session can execute them in order with one shared verification pass. Individually they close real gaps: the navbar advertises the current plan but offers no upgrade path; a website can never be deleted from the dashboard (and would leave orphaned data if it could); language names mixed with codes ("العربية" vs "EN") are inconsistent across surfaces; 8 of 11 app-footer links are dead `href="#"` and no legal pages exist; and the super-admin console that the owner plans to rebuild as a standalone app is currently embedded here.

## Current state (facts found in the repo)
- **Navbar** (`src/features/shell/components/Navbar.tsx`): the only persistent app nav (no dashboard sidebar exists). Signed-in members see `PlanBadge` (`src/features/monetization/components/PlanBadge.tsx` → `plan.current_plan`) and links to Dashboard + sign out. `src/app/[locale]/layout.tsx` resolves `planId` on every request and passes it to `Navbar`. There is **no** pricing page, no upgrade action, no checkout — the phrase "Upgrade to Pro" exists only as `paywall.upgrade_hint` ("coming soon") inside `PaywallPrompt`. Plan limits live in `src/features/monetization/plans.ts` (FREE: 1 site / 4 pages / 1 language / 2 AI gens per day; PRO: 10 sites / 50 pages / 2 languages / 50 gens per day / custom domain).
- **Delete**: `deleteSite(id)` already exists in `src/features/sites/repository.ts:124` but is referenced **nowhere** — no API route, no UI. `src/app/api/sites/[siteId]/route.ts` is GET-only. `SiteCard` (`src/features/dashboard/components/SiteCard.tsx`) is a single `<a>` with no actions. No `window.confirm` anywhere; the app's confirm pattern is a `fixed inset-0 z-50 bg-black/40` overlay + `mono-surface` card (see `PublishControl`). A site holds `images: Record<string, SiteImage>` (each `{ s3Key }` under `sites/{siteId}/…`, deletable via `isImageKeyForSite` in `src/features/images/lib/s3.ts`) and analytics rows in the `pageviews` collection (keyed by `siteId` ObjectId).
- **Language labels**: hardcoded full names in four places — `LanguageSwitcher.tsx:14` (`otherLocale === "ar" ? "العربية" : "English"`), `LiveLocaleSwitcher.tsx:4-7` (`LOCALE_LABELS = { en: "EN", ar: "العربية" }`), `SiteCard.tsx:36` (`l === "ar" ? "العربية" : "English"`), and the landing `Languages.tsx:23,40` blocks (`EN — English` / `AR — العربية`). `TemplatePreviewShell` already uses raw codes.
- **Footer** (`src/features/shell/components/Footer.tsx`): rendered on every locale page by `[locale]/layout.tsx`. 8 of 11 links are `href="#"`; `#how`/`#features` only work on the landing page. Landing anchors: `#features`, `#how`, `#languages`, `#proof`. There is no `legal/`, `pricing/`, or `about` route.
- **Super admin** (complete inventory in `epics/15-notes-fixes/05-remove-super-admin/`): `src/app/[locale]/admin/**` (layout + overview + users list/detail + billing page), `src/app/api/admin/**` (7 handlers), the whole `src/features/admin/**` folder, monetization admin-only modules (`lib/admin-auth.ts`, `api/admin-set-subscription.ts`, `api/admin-record-payment.ts`), repo fns `getAdminRole`, `adminSetSubscription`, `listBillingByAdmin`, the `AdminRole` type + `role` field on `Membership` (`models in monetization/types.ts`), and the `admin.*` message namespace in `en.json`/`ar.json`. `AccountStatus`/`getAccountStatus` gating is **not** admin-only — the app paywall depends on it and must stay. The `admin_audit` collection belongs to the future admin app as well. Epic 12 planning artifacts (`epics/12-super-admin-dashboard/`, `prompt/15-epic12-super-admin.md`, Epic 11's `04-admin-subscription-and-payment-apis.md`) are the source material for that future app — they stay.

## Scope boundaries
**In:** the five items above, implemented as detailed in the milestone task files.
**Out (future/elsewhere):**
- Real payments / checkout / Stripe / plan upgrade execution — no payment provider exists, and adding one needs a new dependency + explicit approval. The upgrade path is a navbar entry + an informational pricing page whose CTA explains upgrades open soon.
- Deleting Epic 12 / super-admin **planning artifacts and prompt files** — they are the spec for the owner's future standalone admin app. Only application code is removed.
- The **published-site** footer (`src/shared/site-render/sections/FooterSection.tsx`) — not part of this change.
- The product template catalog, published-site rendering, data model rework (beyond the minimal `role`/`AdminRole` removal), new pages beyond pricing/privacy/terms, and any new npm dependency.

## Milestones (execution order — all five are independent but run in one session)
1. **01-upgrade-from-navbar** — "Upgrade" entry in the navbar (free plans only) + a public `/[locale]/pricing` page comparing Free vs Pro.
2. **02-delete-site-confirmation** — `DELETE /api/sites/[siteId]` route handler + feature fn with owner guard and best-effort cleanup; typed-name-confirmation dialog on the dashboard `SiteCard`.
3. **03-locale-labels-ar-en** — normalize every in-app language label to the codes `ar`/`en`.
4. **04-footer-links-and-legal** — create `/[locale]/privacy` + `/[locale]/terms` (EN + AR) and rewire all footer links to real targets.
5. **05-remove-super-admin** — delete admin pages/APIs/feature code, strip admin-only monetization surface, remove the `admin.*` messages; keep non-admin gating intact.

## Cross-epic dependencies
- `plan.*`, `nav.*`, `paywall.*`, `dashboard.*` message namespaces already exist; new keys join `nav`, `dashboard`, and new `pricing.*`, `delete.*`, `legal.*` namespaces in **both** `src/messages/en.json` and `src/messages/ar.json` (Arabic verbatim per task file, never invented).
- `src/app/[locale]/layout.tsx` already passes `planId` to `Navbar` — no layout change needed for the upgrade entry.
- The `PageviewDay`/`pageviews` shape (`src/features/analytics/repository.ts`) and `isImageKeyForSite` (`src/features/images/lib/s3.ts`) define the delete-cleanup contract.
- Epic 14's engine seams are untouched by this epic (no `SiteRenderer`/section changes).

## Product invariants (never broken)
- No structural/drag-and-drop editing surface; publish and editing remain separate actions; Arabic is a first-class RTL version, never a translation skin.
- No new npm dependencies without human approval (CODE_RULES §4).
- No hardcoded user-facing strings — every label/text added goes through `next-intl` with EN + AR keys.
- RTL-safe layout only: logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) in any new markup.
- API ownership rule: every owner-scoped endpoint returns `401` (no session) or `404` (not owner) — never 403 leaks.
- The separate-future-admin decision is binding: this app must end up with zero super-admin surface, while `AccountStatus` app-gating stays functional.
- Build rule (binding): never `npm run build` while a dev server runs — stop port 3000's listener, `Remove-Item -Recurse .next`, run `npm run build` plainly (never piped through `Select-Object`), restart via `start-dev.bat`, then verify `/api/health` returns `{"status":"ok"}`. Dev server is crash-prone during heavy compiles; use `npm run build` + `next start -p 3001` for verification, on Windows PowerShell never use `$PID` (reserved).