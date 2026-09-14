# M02 — Phone Verification Flow

## Goal
Wire up the `better-auth` `phone-number` plugin for OTP-based phone verification. The plugin is already in `node_modules/better-auth/dist/plugins/phone-number/` — no new npm dependency.

## Context
- `src/shared/auth/server.ts`: `betterAuth()` options configure `emailAndPassword: { enabled: true }`. We need to add the `phone-number` plugin.
- The plugin requires a `sendOTP` callback — a function that sends the OTP via SMS. Since no SMS provider is configured, this callback logs the OTP to the server console (dev) and is designed to be swapped for Twilio/SNS in production.
- The plugin adds `phoneNumber` and `phoneNumberVerified` fields to the better-auth `user` table (MongoDB `user` collection).

## Implementation Steps

### Step 1: Add phone-number plugin to better-auth config
In `src/shared/auth/server.ts`:
```ts
import { phoneNumbers } from "better-auth/plugins";
// ...
const options: BetterAuthOptions = {
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  baseURL: url,
  secret,
  plugins: [
    phoneNumbers({
      sendOTP: async ({ phoneNumber, code }) => {
        // DEV: log to console. PROD: replace with Twilio/SNS.
        console.log(`[SMS] To ${phoneNumber}: OTP is ${code}`);
      },
    }),
  ],
};
```

### Step 2: Add `phoneNumber` to SignUpForm
- Add a phone number field to the sign-up form.
- Add a "Send OTP" + "Verify OTP" flow before submitting the form.
- The form must: collect phone → send OTP → collect OTP → verify → sign up.

**Approach:** Use the better-auth client: `authClient.phoneNumber.sendOtp({ phoneNumber })` and `authClient.phoneNumber.verify({ phoneNumber, code })`. After verification, proceed with `authClient.signUp.email(...)`.

### Step 3: Store verified phone in `phoneIdentities` collection
After phone verification succeeds, store the phone in the `phoneIdentities` collection (from MM01). This is separate from better-auth's `user.phoneNumber` field — it's our trial-eligibility index with a unique constraint.

### Step 4: Client-side phone form UI
The `SignUpForm` needs:
- Phone input field (with `+` prefix guidance)
- "Send verification code" button
- 6-digit OTP input
- "Verify" button → then show email/password fields
- If phone is already used (duplicate), show error: "This phone number is already registered"

## Phone OTP Flow Sequence
```
User fills form:
  Name → Email → Phone → Password → Confirm
  
On submit:
1. Send OTP to phone (authClient.phoneNumber.sendOtp)
2. User enters OTP
3. Verify OTP (authClient.phoneNumber.verify)
4. Check phone uniqueness in phoneIdentities (API call to our backend)
   - If duplicate → error "phone already registered"
   - If new → store phone identity + proceed
5. Create account (authClient.signUp.email — includes phone in better-auth user)
6. Trial subscription created (EPIC-20, lazy via resolveSubscriptionForUser)
7. Redirect to dashboard
```

**Important:** Phone verification happens BEFORE better-auth account creation. If the phone is a duplicate, we reject before creating a new user account.

## Acceptance Criteria
- [ ] `phone-number` plugin configured in better-auth with `sendOTP` callback
- [ ] `sendOTP` callback logs OTP to console (dev) / documented for prod SMS swap
- [ ] SignUpForm collects phone, sends OTP, verifies, then signs up
- [ ] Verified phone stored in `phoneIdentities` collection
- [ ] Duplicate phone → rejected before account creation
- [ ] `authClient.phoneNumber` methods work (sendOtp, verify)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

## Validation
1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 warnings
3. Sign-up form includes phone + OTP verification steps
4. `sendOTP` callback is wired (check server logs for OTP)
5. Duplicate phone is rejected at the API layer
