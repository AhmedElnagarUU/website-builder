# Task — Freeze / suspend / reactivate accounts

## Title
Admin freeze/suspend/reactivate with immediate effect and audit logging

## Context
The operator must be able to stop a user from misusing the app (freeze = pause/limit, suspend = full block) and reactivate, with the effect taking hold immediately through the monetization guard, and an audit trail of who did it.

## Scope
Admin UI control on the user detail to switch account status (`active`/`frozen`/`suspended`), an admin-guarded status-change API, and an audit log entry for every change.

## Technical details
- Files: API `PATCH /api/admin/users/[userId]/status` (`src/features/admin/api/set-user-status.ts`) + UI in `UserDetail`; audit log `src/features/admin/api/audit.ts` → `admin_audit` collection (immutable records).
- Status change calls the monetization subscription/account-status setter (Epic 11 M04/ M01) so `getUserAccountStatus` reflects immediately; the monetization guard (Epic 11 M02) already returns 403 for frozen/suspended on the gated routes — verify this end-to-end.
- Audit entry: `{ adminUserId, targetUserId, action: "freeze"|"suspend"|"reactivate", detail, createdAt }`.
- Guard: admin-only; confirmation step in UI before changing status (destructive-ish), bilingual.
- Show current status clearly on the user detail.

## Dependencies
- M02 task 01 (user detail). Epic 11 (account status + setter + guard).

## Out of scope
- Billing edits (M03). Notifications to the user (future).

## Acceptance criteria
- Admin can freeze/suspend/reactivate a user; non-admin → 403.
- The gated product routes for that user immediately return 403 (frozen/suspended) and work again on reactivate (active).
- Every status change appends an immutable audit entry with admin + target + action.
- Confirmation shown; EN + AR correct.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps; build per build rule.
- ESLint clean; typecheck passes; status change + guard effect + audit verified e2e.
