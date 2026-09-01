# Task 02 — Build localized sign-in and sign-up pages

## Context

The product's owner is a non-technical business owner, possibly Arabic-speaking. Auth pages are the first screens they see, so they must be simple, bilingual, and RTL-correct from day one. They consume the better-auth client built in Task 01.

## Scope

- `/{locale}/auth/sign-up`: name (optional), email, password + confirmation. Creates account then redirects to `/{locale}/dashboard`.
- `/{locale}/auth/sign-in`: email, password. Redirects to `/{locale}/dashboard`.
- Client-side validation + plain-language inline errors; server error mapping (invalid credentials, email already exists).
- Cross-links between the two pages.
- Both pages render correctly in RTL (labels, inputs, icons flip where directional).

## Technical details

Files live in the auth feature: `src/features/auth/components/SignInForm.tsx`, `SignUpForm.tsx`; pages under `src/app/[locale]/auth/{sign-in,sign-up}/page.tsx` are thin wrappers.

Rules:
- Use `shared/ui` primitives only (Button, Input, Label, Card). No icon libraries.
- Password minimum length 8; show requirement hint under the field.
- Never reveal whether an email exists on sign-in failure — one generic error ("Invalid email or password").
- On success call router.push to dashboard; also refresh server components state.
- All strings through next-intl under namespace `auth.*`.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `auth.sign_in.title` | `Sign in` | `تسجيل الدخول` |
| `auth.sign_up.title` | `Create your account` | `أنشئ حسابك` |
| `auth.field.name` | `Your name (optional)` | `اسمك (اختياري)` |
| `auth.field.email` | `Email` | `البريد الإلكتروني` |
| `auth.field.password` | `Password` | `كلمة المرور` |
| `auth.field.password_confirm` | `Confirm password` | `تأكيد كلمة المرور` |
| `auth.action.sign_in` | `Sign in` | `تسجيل الدخول` |
| `auth.action.sign_up` | `Create account` | `إنشاء الحساب` |
| `auth.hint.password` | `At least 8 characters.` | `٨ أحرف على الأقل.` |
| `auth.error.invalid_credentials` | `Invalid email or password.` | `البريد الإلكتروني أو كلمة المرور غير صحيحة.` |
| `auth.error.email_exists` | `An account with this email already exists.` | `يوجد حساب بهذا البريد الإلكتروني بالفعل.` |
| `auth.error.password_mismatch` | `Passwords do not match.` | `كلمتا المرور غير متطابقتين.` |
| `auth.link.to_sign_up` | `Don't have an account? Create one` | `ليس لديك حساب؟ أنشئ حساباً` |
| `auth.link.to_sign_in` | `Already have an account? Sign in` | `لديك حساب بالفعل؟ سجّل الدخول` |

## Dependencies

- `epics/01-foundation/03-authentication/01-better-auth-setup-and-api.md`
- `epics/01-foundation/02-i18n-foundation/01-next-intl-en-ar-rtl.md`

## Out of scope

- Navbar/shell (Milestone 04), dashboard content (Epic 06).
- Password reset flows.

## Acceptance criteria

- [ ] Creating an account via the form lands on `/{locale}/dashboard` signed-in.
- [ ] Signing in with wrong password shows `auth.error.invalid_credentials` inline, in the active locale.
- [ ] Mismatched confirmation shows `auth.error.password_mismatch` before any request is sent.
- [ ] In `/ar/auth/*`, all labels render Arabic and the layout is right-to-left (fields aligned to the right edge, no mirrored padding bugs).
- [ ] No hardcoded strings (code inspection); both catalogs contain identical key sets.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no new dependencies.
