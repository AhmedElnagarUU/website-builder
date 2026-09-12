# Task — Remove Admin UI, API, Feature Code, and Messages

## Title
Delete the embedded super-admin console: pages, API handlers, `src/features/admin/**`, and the `admin.*` message namespace.

## Context
The admin dashboard lives inside this app today but will be rebuilt as a separate application by the owner. All of it must be deleted here.

## Scope
Delete (verify each path exists before deleting; report any that don't):
1. `src/app/[locale]/admin/` — `layout.tsx`, `page.tsx`, `users/page.tsx`, `users/[userId]/page.tsx`, `billing/page.tsx`.
2. `src/app/api/admin/` — `users/route.ts`, `users/[userId]/route.ts`, `users/[userId]/status/route.ts`, `users/[userId]/subscription/route.ts`, `users/[userId]/billing/records/route.ts`, `revenue/route.ts`, `audit/route.ts`.
3. `src/features/admin/` — entire folder (`lib/roles.ts`, `api/set-user-status.ts`, `api/audit.ts`, `components/{AdminNav,UserTable,UserDetail,SubscriptionEditor,ManualPaymentForm,RevenueCard}.tsx`, anything else inside).
4. Messages: remove the whole `admin` namespace from `src/messages/en.json` and `src/messages/ar.json` (check no other namespace references it, e.g. navigation arrays).

Then verify with `tsc --noEmit` + `npm run lint`; resolve any dangling imports — e.g. if a remaining file imports `requireAdmin`/`isAdmin`/admin message keys, that import is now orphaned and must be removed too (never relocate admin logic). Watch in particular `src/features/shell/**` and `src/app/[locale]**`: those must be clean of admin references (`Navbar`/`Footer`/layout do **not** link to admin today — confirm nothing breaks).

## Dependencies
CODE_RULES.md; M05 shared context.

## Out of scope
Anything monetization/role-code related (task 02). Deleting `epics/12-*` or any `prompt/` file. The `admin_audit` **collection** in Mongo (it belongs to the future app's data; no migration needed now).

## Acceptance criteria
1. The listed paths are gone; `/en/admin`, `/en/admin/users`, and `/api/admin/users` return **404** after build.
2. `tsc --noEmit` + `npm run lint` pass — no orphaned imports remain.
3. `admin` namespace absent from both message files.
4. `epics/12-super-admin-dashboard/` and `prompt/15-epic12-super-admin.md` still exist untouched.