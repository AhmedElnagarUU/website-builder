# M01 — Phone Data Model & Normalization

## Goal
Create a `phoneIdentities` collection in MongoDB with a unique index on normalized phone numbers, plus a normalization utility function.

## Context
- MongoDB is accessed via `src/shared/db/database.ts` → `getDb()`.
- Collections are used directly (no ODM).
- `better-auth` phone-number plugin stores `phoneNumber` + `phoneNumberVerified` on the `user` table — but for the **uniqueness** constraint, we need our own collection with a unique index.

## Data Model

Collection: `phoneIdentities`
```ts
interface PhoneIdentity {
  _id: ObjectId;
  userId: ObjectId;          // better-auth user ID
  phoneNumber: string;       // normalized E.164, e.g. "+201234567890"
  verifiedAt: Date;          // when the phone was verified
  createdAt: Date;
}
```

**Unique index:** `{ phoneNumber: 1 }` — prevents duplicate phone entries at the database level.

## Normalization Rules

Create `src/features/auth/lib/phone.ts`:
```ts
export function normalizePhone(raw: string): string {
  // Strip all non-digit characters
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = "+" + digits.slice(2);
  } else if (!raw.includes("+")) {
    // No + prefix — assume local format, strip leading 0
    digits = digits.replace(/^0+/, "");
    // Cannot determine country code without + — caller should require it
    digits = "+" + digits;
  }
  return digits;
}
```

Wait — this is fragile. For the Gulf target market, most users enter numbers like:
- `+20 12 3456 7890` (Egypt, with country code)
- `012 3456 7890` (Egypt, local)
- `201234567890` (Egypt, no +)

**Refined approach:** The sign-up form tells users to enter their number with the country code (e.g. `+20XXXXXXXXXX`). We normalize by:
1. Strip all non-digit except leading `+`
2. If starts with `00`, replace `00` → `+`
3. If no `+` prefix, reject (require country code input)
4. If `+` prefix exists but leading `0` follows (e.g. `+2000`), strip the extra `0`

```ts
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  let formatted = trimmed.replace(/[^\d+]/g, "");
  if (formatted.startsWith("00")) {
    formatted = "+" + formatted.slice(2);
  }
  // Remove any + not at position 0
  formatted = formatted.replace(/\+/g, "");
  if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
    formatted = "+" + formatted;
  }
  // Strip leading zeros after country code (e.g. +200123... → +20123...)
  if (formatted.startsWith("+")) {
    formatted = "+" + formatted.slice(1).replace(/^0+/, "");
  }
  return formatted;
}
```

Validation: must match `^\+\d{8,15}$` (E.164: + followed by 8-15 digits).

## Implementation Steps

### Step 1: Create `src/features/auth/lib/phone.ts`
- `normalizePhone(raw: string): string`
- `isValidPhoneE164(normalized: string): boolean`
- `isTrialEligiblePhone` not needed here — that's MM03.

### Step 2: Create `src/features/auth/repository.ts` (or add to monetization repo)
Actually, phone identity is an auth concern. Create `src/features/auth/repository.ts`:
- `storePhoneIdentity(userId, phoneNumber, verifiedAt)` — atomic insert with `insertOne` (catches duplicate key error)
- `findPhoneIdentity(phoneNumber)` — lookup by normalized phone
- `findUserIdByPhone(phoneNumber)` — returns userId or null

### Step 3: Add unique index
In `src/shared/db/indexes.ts` (check if it exists), add:
```ts
await db.collection("phoneIdentities").createIndex(
  { phoneNumber: 1 },
  { unique: true }
);
```

## Acceptance Criteria | Status |
|---|---|
| `normalizePhone` correctly normalizes +20 123 456 7890, 00201234567890, +201234567890 → +201234567890 | ✅ DONE |
| `isValidPhoneE164` rejects invalid formats | ✅ DONE |
| `phoneIdentities` collection has unique index on `phoneNumber` | ✅ DONE |
| `storePhoneIdentity` throws/rejects on duplicate (DB-level) | ✅ DONE |
| `findPhoneIdentity` finds by normalized phone | ✅ DONE |
| `npx tsc --noEmit` passes | ✅ PASS |
| `npm run lint` passes | ✅ PASS |

## Validation
1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 warnings
3. Unit test normalization with sample Gulf numbers
4. Verify unique index exists in MongoDB
