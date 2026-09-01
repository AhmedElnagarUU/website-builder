# Task 02 — Business information form screen

## Context

Step 1 is the ONLY screen requiring real effort from the user, so friction here is the product's biggest risk. The form is short, grouped into human sections, autosaves constantly, and asks normal business questions — never design questions (product invariant).

## Scope

- Page `/{locale}/create/business-info?site={id}` rendering a single-column grouped form per this milestone's field list.
- Loads existing site (resume case) and prefills.
- Debounced autosave (~800ms after last keystroke) via PATCH; visible subtle "Saved" indicator after each successful save.
- Searchable category select filtering the five fixed categories (simple client-side filter over a static list; no new dependency).
- Repeatable short lines for `usps` (add up to 5) and `notes` (up to 5).
- Continue button: disabled until required fields valid; on click sends `advance:true` then routes to `/{locale}/create/templates?site={id}`.
- Back navigation not needed (first screen); direct URL access without `site` param redirects to dashboard placeholder for now.

## Technical details

Files:

```
src/features/create-wizard/components/BusinessInfoForm.tsx
src/features/create-wizard/lib/categories.ts        // the 5 categories with en/ar labels from MILESTONE.md
src/features/create-wizard/lib/useAutosaveForm.ts   // small hook: values + debounced PATCH + savedAt state
src/app/[locale]/create/business-info/page.tsx      // thin wrapper (server: fetch site, pass DTO)
```

Rules:
- Client component form; server page loads site via repository directly (no HTTP self-call), checks ownership, passes DTO.
- Validation UX: inline error text under required fields only after first submit attempt or blur; optional fields NEVER block.
- Phone/email inputs use correct `type`/`inputMode`; Arabic locale renders labels RTL (logical spacing only).
- All strings through next-intl namespace `wizard.business.*`.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `wizard.business.title` | `Tell us about your business` | `أخبرنا عن مشروعك` |
| `wizard.business.group.about` | `About your business` | `عن مشروعك` |
| `wizard.business.field.name` | `Business name` | `اسم المشروع` |
| `wizard.business.field.category` | `Business category` | `نشاط المشروع` |
| `wizard.business.field.category_placeholder` | `Search categories…` | `ابحث في الأنشطة…` |
| `wizard.business.field.description` | `What does your business do?` | `ماذا يقدم مشروعك؟` |
| `wizard.business.group.customers` | `Who you serve` | `من تخدم` |
| `wizard.business.field.target_customers` | `Who are your customers?` | `من هم عملاؤك؟` |
| `wizard.business.field.services` | `What services or products do you offer?` | `ما الخدمات أو المنتجات التي تقدمها؟` |
| `wizard.business.group.contact` | `How can customers reach you?` | `كيف يمكن للعملاء الوصول إليك؟` |
| `wizard.business.field.location` | `Location` | `الموقع` |
| `wizard.business.field.phone` | `Phone number` | `رقم الهاتف` |
| `wizard.business.field.email` | `Email` | `البريد الإلكتروني` |
| `wizard.business.group.extra` | `Anything else? (optional)` | `هل من شيء آخر؟ (اختياري)` |
| `wizard.business.field.usps` | `What makes you different?` | `ما الذي يميزك؟` |
| `wizard.business.action.add_line` | `Add another line` | `أضف سطراً آخر` |
| `wizard.business.field.notes` | `Anything else we should know?` | `هل هناك ما يجب أن نعرفه؟` |
| `wizard.common.continue` | `Continue` | `متابعة` |
| `common.saved` | `Saved` | `تم الحفظ` |
| `wizard.business.error.name_required` | `Please enter your business name.` | `يرجى إدخال اسم المشروع.` |
| `wizard.business.error.category_required` | `Please choose a category.` | `يرجى اختيار نشاط المشروع.` |

Category labels live in `categories.ts` (already bilingual) and render through the same translation approach (label picked by active locale).

## Dependencies

- `epics/02-site-creation-flow/02-business-info-step/01-business-info-api.md`
- `epics/01-foundation/04-app-shell-navigation/01-navbar-language-switcher-shell.md`

## Out of scope

- Template selection screen (next milestone), language screen, generation.
- Dashboard entry button (Epic 06 wires it to POST /api/sites → this page).

## Acceptance criteria

- [ ] With `?site={id}`, previously saved values prefill; typing any optional field autosaves within ~1s and shows "Saved" in both locales ("تم الحفظ").
- [ ] Continue disabled until name non-empty AND category chosen; enabled otherwise.
- [ ] Clicking Continue lands on `/ar/create/templates?site=…` (Arabic locale preserved) and site DTO now has `currentStep='templates'`.
- [ ] Category select filters as you type (e.g. typing "res" shows Services) and stores the id, not the label.
- [ ] In Arabic, all labels are Arabic and the whole form is RTL (right-aligned text, correct start/end alignment of indicators).
- [ ] Refreshing mid-typing loses at most the last ~1s of input.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; no new dependencies.
