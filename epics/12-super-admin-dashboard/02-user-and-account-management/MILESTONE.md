# Milestone 02 — User & Account Management

## Goal
Let the admin see the user base and intervene on individual accounts: list/search users, view a user's profile/sites/subscription/billing, and **freeze / suspend / reactivate** accounts with an audit trail.

## Shared context
- Account status semantics (from Epic 11): **frozen** = account paused/limited (billing on hold); **suspended** = fully blocked. **Reactivate** = back to `active`. The monetization guard (Epic 11 M02) already turns these into 403s at the routes; this milestone provides the admin UI + status-change API.
- Admin reads are owner-scoped from the super-admin's perspective: an admin can view any user row.
- **Audit log:** every status change / admin action records `{ adminUserId, targetUserId, action, detail, createdAt }` (immutable). Kept minimal here; reused for billing actions in M03.

## Tasks
1. **01-user-listing-and-search** — admin Users page: list/sort/search users + overview (sites, published, plan, status); user detail view.
2. **02-freeze-suspend-reactivate** — admin status-change UI + API (`PATCH /api/admin/users/[userId]/status`) with audit logging; reflects immediately in the monetization guard.
