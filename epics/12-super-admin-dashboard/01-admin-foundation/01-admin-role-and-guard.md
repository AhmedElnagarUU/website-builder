# Task — Admin role and guard

## Title
Add the super-admin role to the user model and an admin guard

## Context
All admin features (this epic) and the admin monetization APIs (Epic 11 M04) need a way to identify and protect the operator. We add a role field and a guard, plus a documented bootstrap step to promote the first admin.

## Scope
Add `role: "user" | "super_admin"` to the user identity, default `"user"`, with `isAdmin(session)`/`requireAdmin(locale)` helpers and a one-time bootstrap to designate the operator as admin.

## Technical details
- Files: user model integration (`src/features/auth/lib/session.ts` + the underlying user record via more-auth/better-auth — extend consistently with how `getSession()` returns user); new `src/features/admin/lib/roles.ts` with `isAdmin(user)` and `requireAdmin(locale)` (redirect to 403/sign-in).
- Default `role` is `"user"` for all existing and new users (migration/backfill sets it).
- Bootstrap: a documented manual step (or tiny script) to set a known admin email's `role` to `super_admin`. Do NOT auto-promote anyone.
- Extend `getSession()` return to include `role` so the guard works without extra queries; keep existing consumers compiling.
- Provide `requireAdminRoute`-style guard used by admin APIs (Epic 11) and pages (this epic).

## Dependencies
- Epic 01 (auth). Epic 11 (subscription/user model) if role is stored adjacent to it.

## Out of scope
- Admin pages/UI (task 02). Admin billing screens (M03). End-user-facing role UI.

## Acceptance criteria
- Every user defaults to `"user"`; the designated admin is `"super_admin"`.
- `requireAdmin` allows only admins (non-admin page → redirect/403, API → 403); unauth → sign-in/401.
- Existing auth/session consumers still compile and behave.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; admin vs non-admin access smoke-tested.
