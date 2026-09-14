# M03 — Registration Integration

## Goal
Integrate phone verification + uniqueness check into the sign-up flow. The phone check happens BEFORE trial creation — if the phone is already used for a trial-eligible account, no new trial is issued.

## Context
- `SignUpForm.tsx` currently calls `authClient.signUp.email(...)` then redirects to dashboard.
- EPIC-20 MM01 creates the trial subscription lazily via `resolveSubscriptionForUser` on the first protected API call.
- We need to insert a phone verification + uniqueness check step before the better-auth signup.

## Implementation Steps

### Step 1: Create a phone-check API endpoint
`src/app/api/auth/check-phone/route.ts`:
```ts
POST /api/auth/check-phone
Body: { phoneNumber: string }
Response: { available: boolean, reason?: string }
```
- Normalize the phone (MM01 `normalizePhone`).
- Look up `phoneIdentities` collection.
- If found → `{ available: false, reason: "phone_already_registered" }`.
- If not found → `{ available: true }`.

### Step 2: Modify SignUpForm
Refactor into a wizard flow:
1. **Step 1 — Phone verification:**
   - User enters phone number.
   - Click "Send code" → calls `authClient.phoneNumber.sendOtp`.
   - User enters 6-digit code.
   - Click "Verify" → calls `authClient.phoneNumber.verify`.
   - On success, check phone uniqueness via `/api/auth/check-phone`.
   - If duplicate → show error, return to phone input.
   - If available → store phone identity (POST `/api/auth/store-phone`) + proceed to Step 2.

2. **Step 2 — Account creation:**
   - Existing fields: Name, Email, Password, Confirm.
   - On submit → `authClient.signUp.email(...)`.
   - On success → redirect to dashboard (trial subscription created lazily by EPIC-20).

### Step 3: Phone identity storage endpoint
`src/app/api/auth/store-phone/route.ts`:
```ts
POST /api/auth/store-phone
Body: { phoneNumber: string, userId: string }
```
- Normalize phone.
- Atomic insert into `phoneIdentities` with `insertOne` (catches duplicate key).
- Returns success or `phone_already_registered`.

**Race condition handling:** The `insertOne` with a unique index is atomic — if two concurrent requests try to insert the same phone, one succeeds and one gets a duplicate key error. This is handled gracefully.

### Step 4: Existing-user compatibility
- Existing users have no phone in `phoneIdentities`. They are NOT blocked — they can still log in and use the app with their existing trial.
- The phone requirement applies only to NEW signups.

| Acceptance Criteria | Status |
|---|---|
| `/api/auth/check-phone` endpoint works (normalize + lookup) | ✅ DONE |
| `/api/auth/store-phone` endpoint works (atomic insert + handles duplicates) | ✅ DONE |
| SignUpForm flows: phone → OTP → verify → check → store → account creation | ✅ DONE |
| Duplicate phone → "phone already registered" error | ✅ DONE |
| Existing users not affected | ✅ DONE |
| `npx tsc --noEmit` passes | ✅ PASS |
| `npm run lint` passes | ✅ PASS |

## Validation
1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 warnings
3. Sign-up flow: enter phone → receive OTP → verify → check phone → create account
4. Try to sign up with a phone that's already registered → rejected
5. Existing user can still sign in (no phone required)
