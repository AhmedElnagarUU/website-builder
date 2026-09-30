# 90 — ACTIVE TASKS: epic inventory & how to claim work

The `epics/` tree (255 files) is the project's spec system. **Never bulk-read it.** This page tells
you what exists, what is verifiably built, and how to pick exactly one task.

---

## 1. The one thing to know about epic status

**Epic/task files contain no completion field.** Any `status:` you grep inside `epics/` is a *TypeScript
enum from a code sample*, not task state. So do not trust a filename or a heading to mean "done" —
confirm against the code, or ask.

The table below therefore reports **code evidence** (does the module/route exist in `src/` today?),
not a claim of completion.

---

## 2. How to work a task (from `AGENTS.md`, restated)

1. Pick **one** task: `epics/<NN-epic>/<MM-milestone>/<KK-task>.md`. One task per session.
2. Read exactly three things: `CODE_RULES.md` (full) → the parent `MILESTONE.md` → your task file.
3. Numbers define execution order across the whole repo (`01-` before `02-`, epic 01 before 02).
   **Dependencies are binding** — if a listed dependency isn't complete, stop and say so.
4. Do not implement another task's scope while you're in there. Respect every `Out of scope` section.
5. Done means: acceptance criteria pass **and** `npm run lint` + `npx tsc --noEmit` + `npm run build`
   are green, and you checked both `en` and `ar`.

---

## 3. Epic inventory

`MS` = number of `MILESTONE.md` files (i.e. that epic's declared work chunks).

| Epic | MS | Code evidence in `src/` (verified 2026-09-27) |
|---|---|---|
| 01-foundation | 4 | Superseded by the app skeleton; no distinct module |
| 02-site-creation-flow | 4 | `features/sites`, `features/create-wizard` |
| 03-ai-content-generation | 2 | `features/generation` (12 files) |
| 04-preview-and-edit | 4 | `features/editor`, `app/preview/[templateId]` |
| 05-ui | 5 | `shared/ui` primitives, `features/landing`, `features/shell` |
| 06-publishing | 4 | `features/publishing`, `app/live/[slug]/…` |
| 07-editor-fidelity-fixes | 3 | inside `features/editor` |
| 08-multi-page-templates | 5 | `content[pageId]` is multi-page; `templates/pages.ts` |
| 09-template-discovery-ux | 3 | `features/templates` (9 files) |
| 10-analytics | 2 | `features/analytics` |
| 11-monetization | 4 | `features/monetization` (17 files) |
| 12-super-admin-dashboard | 3 | partial: `dashboard/overview` route is **business**-side, not super-admin |
| 13-template-full-preview | 3 | `features/template-preview` (1 file) |
| 14-template-modern-redesign | 7 | `templates/catalog.ts` theme axis; see `04-DESIGN/`, `05-TEMPLATE/` |
| 15-notes-fixes | 5 | rounds of fixes — code folded into owning features |
| 16-notes-round2 | 4 | same |
| 17-mongoose-migration | 5 | **done** — types use `Types.ObjectId`; mongoose in `shared/db` |
| 17-mvp-stabilization | 0 | no milestone files |
| 18-langchain-migration | 2 | `generation/lib/ai-client` provider abstraction |
| 18-production-hardening | 0 | no milestone files |
| 19-testing-infrastructure | 0 | no milestone files — **no test suite exists yet** |
| 20-monetization-trial | 0 | `app/api/trial/status` present |
| 21-phone-identity | 0 | `app/api/auth/{check-phone,store-phone}` present |
| 22-popup-ui | 0 | no distinct module found |
| 23-paymob-payments | 6 | **REMOVED** — Paymob fully removed (code, pixel, webhook route, `PAYMOB_*` env) |
| 24-polar-migration | 0 | `features/payments/polar` + `app/api/webhooks/polar` — **Polar provider**, see below |

### Where payments work stands (24-polar-migration + expansion EPIC 1) — POLAR + EG MANUAL

Done: provider abstraction + Polar provider · hosted-checkout `url` through the seam · Standard
Webhooks HMAC verification · idempotent `order.paid` processing · `POST /api/checkout` returns the
session and the browser follows `url` · return-from-Polar poll on `/pricing?paymentId=` · self-hosted
fonts (removes the Google Fonts build failure).

Done (Paymob removal): `paymob/` module, Paymob pixel, `/api/webhooks/paymob` route and all
`PAYMOB_*` env vars removed; there is no fallback logic.

Done (expansion EPIC 1): `user.country` captured server-side at signup (`shared/auth/server.ts`,
`input: false`, never from a request body) and exposed on `SessionUser` · one shared rule
`getAvailablePaymentMethods(country)` in `features/payments/lib/payment-methods.ts` (EG → polar +
Vodafone Cash + InstaPay, everyone else → Polar only), enforced server-side by `POST /api/checkout`
(422 `method_unavailable`) · manual methods run `initiated → awaiting_verification → paid` on the
existing `PaymentRecord` model with proof at `POST /api/checkout/[paymentId]/proof` and admin-only
grant at `POST /api/checkout/[paymentId]/verify` · read-time expiry
(`MANUAL_PAYMENT_EXPIRE_HOURS`, default 24) · checkout UI renders method tabs for EG accounts, Polar
flow unchanged · `.env.example` documents `ADMIN_EMAILS`,
`MANUAL_PAYMENT_VODAFONE_NUMBER`, `MANUAL_PAYMENT_INSTAPAY_NUMBER`.

Not done (needs a human):
- Set `ADMIN_EMAILS` — without it **nobody can verify** a manual payment.
- Set `MANUAL_PAYMENT_VODAFONE_NUMBER` / `MANUAL_PAYMENT_INSTAPAY_NUMBER` — the EG instructions
  render with an empty number until these are set.
- Register the Polar dashboard webhook endpoint (`https://<domain>/api/webhooks/polar`, subscribe
  `order.paid` + `subscription.*`) and verify a real `order.paid` round-trip.
- Accounts created before EPIC 1 have no `country` → Polar only until they re-register.

---

## 4. Roadmap

Longer-range intent (moved here from `docs/07-roadmap/`):

- `roadmap/00-master-roadmap.md`
- `roadmap/00-implementation-plan.md`

---

## 5. Gaps worth knowing (no task file exists for these)

- **No test suite** (epic 19 has no milestones). Verification today is
  `lint` + `tsc` + `build` + manual acceptance checks.
- **Super-admin** (epic 12) has no clear module; the `dashboard/overview` route that exists is the
  business dashboard, a different thing.
- **Popup UI** (epic 22) has no trace in `src/`.
- Several newer business features (`customers`, `requests`, `services`, `tutorial`,
  `images/sign-url`, `sites/settings`) exist in code with **no corresponding epic folder** — the
  specs for that work are not in this repo. Treat their `types.ts` as the contract.
