# Task 01 — Generation progress screen with polling & retry

## Context

Step 4 is pure waiting, and waiting feels broken unless progress is visible. The user has already done all the work; this screen's only jobs are reassurance, automatic hand-off when content is ready, and a friction-free retry if generation failed.

## Scope

- Page `/{locale}/create/generating?site={id}`.
- On mount: POST `/api/sites/:id/generate`. Handle start-guards:
  - `409 generation_running` → skip starting, just poll (resume case).
  - Other `409` codes (`missing_required_info`, `no_template`, `no_languages`) → silently route back to the matching earlier step (resume-repair case). Never show raw error text.
- Poll GET `.../generation-status` every 2s.
- Rotating friendly status messages (list below), cycling every ~4s while running.
- `complete` → router.replace to `/{locale}/sites/{id}/editor`.
- `failed` → show plain-language failure message + single Retry button (re-POST generate, resume polling). Inputs are untouched by design (engine contract).
- Client-side stuck detection: status `running` for >90s → treat as failed (same retry path).
- No back navigation offered during running (nothing to go back to); browser-back is allowed and harmless (state machine resumes correctly).

## Technical details

Files:

```
src/features/create-wizard/components/GenerationProgress.tsx   // client component
src/features/generation/lib/useGenerationPolling.ts            // hook: poll + states
src/app/[locale]/create/generating/page.tsx
```

Rules:
- Spinner/progress indicator + one message line at a time. Minimal, calm UI.
- Strings via next-intl namespace `wizard.generating.*`.

### Strings introduced (exact keys/values)

| Key | en | ar |
|---|---|---|
| `wizard.generating.title` | `Writing your website…` | `نكتب موقعك…` |
| `wizard.generating.msg.hero` | `Writing your homepage…` | `نكتب صفحتك الرئيسية…` |
| `wizard.generating.msg.services` | `Adding your services…` | `نضيف خدماتك…` |
| `wizard.generating.msg.about` | `Telling your story…` | `نحكي قصتك…` |
| `wizard.generating.msg.contact` | `Setting up your contact details…` | `نجهّز بيانات التواصل…` |
| `wizard.generating.failed_title` | `We couldn't finish writing your website.` | `لم نتمكن من إنهاء كتابة موقعك.` |
| `wizard.generating.retry` | `Try again` | `حاول مجدداً` |

## Dependencies

- `epics/03-ai-content-generation/01-generation-engine/03-generate-and-status-endpoints.md`
- `epics/02-site-creation-flow/04-language-choice/02-language-choice-screen.md` (hands off here)

## Out of scope

- The editor page itself (Epic 04; placeholder acceptable at its URL until then).
- Cancel/abort generation action.

## Acceptance criteria

- [ ] Happy path: messages rotate while polling shows running; on complete the browser lands on `/ar/sites/{id}/editor` (or en per active locale) without user action.
- [ ] Resume: revisiting the URL mid-run does NOT double-start (no second job — server stays single-flight).
- [ ] Failure path (provider unreachable): after failed status, user sees `failed_title` + Try again in their locale; clicking it restarts polling; no stack traces or API wording anywhere.
- [ ] Stuck run (>90s) flips to the same retry UI automatically.
- [ ] Visiting with `missing_required_info` guard triggers redirect back into the wizard rather than an error.
- [ ] RTL rendering correct in Arabic.
- [ ] `npm run lint && npm run typecheck && npm run build` pass.

## Definition of Done

Per `CODE_RULES.md`; acceptance criteria pass; no hardcoded strings; no new dependencies.
