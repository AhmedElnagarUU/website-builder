# Milestone 01 — Admin Foundation

## Goal
Establish the super-admin role and guard, and a protected admin area with its own shell/navigation, so all later admin features live in one governed space.

## Shared context
- **Role model:** add `role: "user" | "super_admin"` to the app's user identity. Default for all existing/new users is `"user"`. The super-admin is a deliberate assignment (seed via a known admin email or manual DB update; document the bootstrap step).
- **Guard:** every admin route/page checks `getSession().user` has `role === "super_admin"`; non-admin → 403 (API) / redirect (page). Unauth → 401 / sign-in.
- **Admin area:** a distinct route (e.g. `/[locale]/admin/...`) NOT linked from the public/user Navbar (or only subtly for admins), with its own admin shell + nav (Overview, Users, Billing).
- i18n: all admin UI strings bilingual EN + AR, RTL-safe.

## Tasks
1. **01-admin-role-and-guard** — add `role` to user model + `requireAdmin(locale)` / `isAdmin(session)` helpers + bootstrap steps for the first admin.
2. **02-admin-area-shell** — the admin route(s), layout with admin nav + overview shell, admin-only page redirect/403 handling.
