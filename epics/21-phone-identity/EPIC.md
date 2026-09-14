# EPIC-21 — Phone Number Identity & Trial Abuse Prevention

## Purpose
Use the user's phone number as a unique identity to prevent trial abuse (creating multiple accounts to get multiple free trials). The `better-auth` `phone-number` plugin is already available in `node_modules/better-auth` — no new npm dependency required.

## Why This Matters
Without phone verification, a user can create unlimited accounts (A, B, C, D...) each getting a 15-day trial. A verified phone number creates a binding identity that prevents this.

## Architecture Decision: Phone as Trial Eligibility Key
**Decision:** A verified phone number can only be associated with one account for trial eligibility. When a new user signs up:
1. They provide and verify a phone number.
2. Before issuing a trial, we check: does this phone number already have a verified account with a trial? If yes → reject (no trial).
3. For existing users (created before this mission): they are NOT locked out. They keep their existing accounts. The phone check applies only to **new trial-eligible registrations**.

## Phone Verification Mechanism
The `better-auth` `phone-number` plugin provides:
- `POST /phone-number/send-otp` — sends a 6-digit OTP via the `sendOTP` callback
- `POST /phone-number/verify` — verifies the OTP
- `POST /phone-number/sign-in` — sign in with phone
- `signInPhoneNumber` — sign in with phone + password

**SMS transport:** No SMS provider (Twilio/SNS) is configured. The `sendOTP` callback is provided by us. For development, we log the OTP to the server console. For production, the callback should be replaced with a real SMS provider (Twilio/SNS) — documented in the code.

## Phone Normalization
Normalize all phone numbers to **E.164 format** before storage and comparison:
- `+201234567890` (Egypt)
- `+12345678901` (US)
- Strip spaces, dashes, parentheses
- If no `+` prefix, attempt to parse country code
- Use a simple regex-based normalizer (no new dependency — `libphonenumber` etc. would require npm install)

Normalization function: strip all non-digit except leading `+`. If starts with `00`, replace with `+`. If no `+` and first digits are `0`, strip the leading `0` and require country code.

For the target market (Gulf region + international), E.164 is the standard format. `+20` for Egypt, `+966` for Saudi Arabia, `+1` for US/Canada.

## Phone Number Uniqueness
- MongoDB collection `phoneIdentities` (or reuse better-auth's `user.phoneNumber` field + a separate index).
- Schema: `{ _id, userId, phoneNumber (normalized, lowercase), verifiedAt, createdAt }`
- Unique index on `phoneNumber` prevents duplicates at the database level.
- `phoneNumber` stored in normalized E.164 form only.

## Existing User Compatibility
- Existing users have no phone number. They are **not blocked**.
- The phone requirement applies only when a user attempts to **start a new trial**.
- Existing users who want to verify a phone can do so later (their trial was already created in EPIC-20).

## Scope Boundaries

### In Scope
- Phone number collection + normalization utility
- Phone OTP verification flow (using better-auth phone-number plugin)
- Phone uniqueness enforcement (DB-level unique index)
- Trial eligibility check: verified phone → not already used → allow trial
- Registration integration: sign-up requires phone verification before trial issuance
- Race condition handling (concurrent signups with same phone)

### Out of Scope
- Replacing better-auth (extending, not replacing)
- Real SMS provider integration (dev: console log; prod: documented injection point)
- Phone number changes by existing users (v1 — can be added later)
- International phone input UI library (use simple input with + prefix guidance)

## Tasks

### MM01 — Phone Data Model & Normalization
- Create `PhoneIdentity` interface + MongoDB collection
- Add unique index on normalized phone number
- Create phone normalization utility function

### MM02 — Phone Verification Flow
- Configure better-auth `phone-number` plugin with `sendOTP` callback
- `POST /phone-number/send-otp` endpoint (via plugin)
- `POST /phone-number/verify` endpoint (via plugin)
- Store verified phone in `phoneIdentities` collection

### MM03 — Registration Integration
- Modify `SignUpForm` to collect phone + verify before signup
- Before trial creation, check phone uniqueness
- Handle race conditions with atomic insert

## Dependencies
- better-auth `phone-number` plugin (already in node_modules)
- EPIC-20 trial creation (phone check happens before trial issuance)
- MongoDB for unique phone index

## Acceptance Criteria
- [ ] Phone number is normalized to E.164 before storage
- [ ] Duplicate phone is rejected at DB level (unique index)
- [ ] OTP is generated and "sent" (console log in dev)
- [ ] Phone must be verified before trial eligibility
- [ ] Second account with same phone → trial rejected
- [ ] Existing users not locked out
- [ ] Race conditions handled (atomic DB operations)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
