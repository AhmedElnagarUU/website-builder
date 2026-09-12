# Milestone 05 — Remove Super-Admin Dashboard

## Goal
Strip every super-admin surface from this application so the owner can rebuild the admin console as a separate future app — per the note: "the super admin … the admin dashboard will be a different app from this app so remove what belongs to it from this application."

## Tasks (execution order)
1. **01-remove-admin-ui-and-api.md** — Delete the admin pages, admin API handlers, `src/features/admin/**`, and the `admin.*` messages.
2. **02-clean-monetization-role-models.md** — Remove admin-only monetization modules and the `role`/`AdminRole` surface from the data model.

## Shared context (binding for this milestone)
- **Keep** the app's non-admin gating: `AccountStatus` (`active | frozen | suspended`) and `getAccountStatus`/status checks feed the paywall (`checkLimit`/`entitlement`) and must keep working.
- **Keep** all Epic 12 planning files (`epics/12-super-admin-dashboard/`, `prompt/15-epic12-super-admin.md`, Epic 11's `04-admin-subscription-and-payment-apis.md`) — they are the spec for the future standalone app.
- Every removal must be confirmed by `tsc --noEmit`: if another non-admin module imports something from the delete list, the task must either keep that something or (preferred, KISS) remove the dangling import with it — never "move admin code into shared/".
- Messages: the `admin.*` namespace is removed from **both** `en.json` and `ar.json`.

## Verification (end of milestone)
`npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass (build rule); `/en/admin` and a sample `/api/admin/users` return **404**; grep confirms no `requireAdmin`, `isAdmin`, `getAdminRole`, `super_admin`, or `AdminRole` remains in `src/`; the app boots and `/api/health` is `{"status":"ok"}`; account status gating logic is intact (code-verified via `checkLimit.ts`/`entitlement.ts`).