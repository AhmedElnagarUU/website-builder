# Task — Invoice / billing ledger model

## Title
Add an immutable billing ledger with atomic append and query helpers

## Context
We need a durable record of every charge/refund/credit so the admin can see and manually adjust billing and a future gateway can append its own records without colliding. Immutability + minor-unit discipline keeps the ledger auditable.

## Scope
Create the ledger collection, append/query repository, and the result types — in minor units — plus extension hooks for a future gateway.

## Technical details
- Files: `src/features/monetization/types.ts`, `repository.ts` (ledger section).
- Record shape (keep minimal):
  ```ts
  type BillingRecord = {
    _id; userId: ObjectId; siteId?: ObjectId;
    kind: "manual_payment" | "manual_discount" | "write_off" | "gateway_charge" | "gateway_refund" | "credit";
    amountMinor: number;      // integer minor units; signed
    currency: string;         // e.g. "USD" | "SAR"
    description?: string;     // bilingual-safe note
    provider?: "manual" | "stripe" | string;   // gateway seam
    providerEventId?: string; // gateway webhook id (future)
    createdBy: string;        // admin user id or "system"/"gateway"
    createdAt: Date; immutable
  };
  ```
  Fields are write-once (no updates); corrections are new records with `kind: "write_off"`/`credit`, never edits.
- Repository: `appendBillingRecord(record)` (atomic insert), `listBillingForUser(userId)`, `sumBillingForUser(userId, since?)`, `listBillingByAdmin(adminUserId, filters?)`.
- Add the schema/type only now; M04 task 02 adds admin APIs, Epic 12 adds the admin UI.

## Dependencies
- M01 subscription model (userId linkage).

## Out of scope
- Gateway integration / webhooks (read: schema + seams only). Admin APIs and UI (task 02 / Epic 12).

## Acceptance criteria
- Appending a billing record persists it; no update path deletes or mutates past records.
- `sumBillingForUser` returns correct minor-unit totals.
- Money fields are integers + currency (no floats); types enforce this.
- No new dependency.

## Definition of Done
- `CODE_RULES.md` read and followed; no new deps.
- ESLint clean; typecheck passes; seed + sum scenario verified.
