# Task — User list, search, and detail view

## Title
Admin Users page: list/search users and view a user's full profile

## Context
The operator needs to know "how many users does the app have" and inspect any user: their plan, subscription, status, sites, and billing — before deciding to intervene.

## Scope
An admin Users list with count + search/sort, and a user detail view combining profile, subscription/plan + account status, their sites, and their billing history. Read-only in this task (status/billing changes are later tasks).

## Technical details
- Files: admin area `src/app/[locale]/admin/users` page + `src/features/admin/components/UserTable.tsx`, `UserDetail.tsx`; admin read APIs `src/features/admin/api/list-users.ts`, `get-user.ts` + routes `GET /api/admin/users` and `GET /api/admin/users/[userId]`.
- Read APIs are admin-guarded (M01). List supports `?q` (search by name/email), sort by created/updated, pagination or cursor.
- Detail composes: user profile (name/email/role), subscription (plan/status/period/accountStatus), sites (via `listSitesByOwner` → count + published), billing (via Epic 11 ledger `listBillingForUser` + `sumBillingForUser`).
- New i18n keys under `admin.users.*` in `en.json`/`ar.json`; mono-styled; RTL-safe.
- Total-user count shown (the headline metric the admin asked for).

## Dependencies
- M01 admin shell + guard. Epic 11 (subscription + ledger read helpers).

## Out of scope
- Status changes (task 02). Billing edits (M03). Audit log writes (task 02, for status).

## Acceptance criteria
- Admin sees total user count and can search/sort the list; only admins can access.
- User detail shows profile, plan/status, sites (+published), and billing history/sum.
- EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; list/detail smoke-tested with seeded users.
