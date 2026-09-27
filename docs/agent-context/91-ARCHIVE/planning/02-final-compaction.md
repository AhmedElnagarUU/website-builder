# COMPACTION1.md — Final
# (Rewrite reflecting full MVP completion: all 6 epics implemented and verified; publishing/live-serving live)

## Objective
- Complete the AI website builder MVP. **All 6 epics (01–06) are fully implemented and verified.** The product promise is now closed end-to-end: a non-technical owner answers questions, picks a template and languages, AI writes the website, the owner lightly edits it, and **publishes it at a system URL** (`/live/[slug]`) with explicit unpublish/re-publish and Arabic as a first-class RTL version. This is the FINAL compaction — the MVP is complete.

## Important Details (still binding)
- **Stack:** Next.js 15.3.3 (App Router) · better-auth · MongoDB · Amazon S3 · Tailwind · next-intl.
- **Environment:** Windows / PowerShell; dev server on port **3000** via `start-dev.bat`.
- **Build rule (mandatory, user-confirmed):** Never run `npm run build` while dev is running. They share `.next`. Safe procedure: stop dev (kill port-3000 process) -> delete `.next` -> `npm run build` -> restart `start-dev.bat` -> verify `/api/health`.
- Accept the harmless `@next/swc-win32-x64-msvc is not a valid Win32 application` warning. Real corruption signs: `/api/health/route.js.nft.json` ENOENT or `Cannot find module './vendor-chunks/@better-auth.js'` -> clear `.next` while dev stopped, then rebuild.
- Next.js version is **15.3.3** (do not downgrade).
- `.env.example`/`.env` are **UTF-16** in `.env.example` (reads as binary-garbage via `Get-Content -Raw`); the working `.env` is now **UTF-8** — read with `Get-Content -Encoding UTF8`. Do not assume which; check.
- AI provider = **Google Gemini**, model **`gemini-3.6-flash`** (do NOT reference `gemini-2.5-flash` — the key cannot use it, hard 404). Generation timeout fixed (`TIMEOUT_MS = 180s`). LangChain declined. See prior section for Gemini request details.
- **Product invariants (permanent, never violate):** No structural/drag-and-drop editing surface ANYWHERE (even disabled). Publishing and editing are separate actions; the live URL always serves the last explicitly-published snapshot; re-publishing is an explicit confirmed action and never silently overwrites published content. Arabic is a first-class RTL version, never a translation skin. No new npm dependencies without human approval. No hardcoded user-facing strings (all via next-intl `en`/`ar`; business-language rule for user-facing labels).

## What was shipped in Epic 06 (final epic)

### M01 — Publish API (publish action + unique slug + POST route)
- `src/features/publishing/publish-site.ts` — `publishSite(siteId)`: owner auth (`getSession()` + `getSiteForOwner`, 401/404), validation (templateId resolvable via `getTemplate` else `not_found`; empty `activeLanguages` → `validation_error`), builds `PublishedSnapshot` EXACTLY per the type contract (templateId, activeLanguages, per-active-locale content, images, brandColor, publishedAt=new Date()), atomically persists via `updateSite` (`publishedSnapshot`, `status:"published"`, `slug`, `hasUnpublishedChanges:false`). **First and only writer of `Site.slug`** (slugified `businessInfo.name` + 6-char suffix, with duplicate-key retry against the unique sparse `slug` index, bounded retries).
- `src/features/publishing/live-url.ts` — `nextUrl(slug, host?)`: canonical public URL `${origin}/live/${slug}`; origin = `NEXT_PUBLIC_SITES_DOMAIN` → `VERCEL_URL` → request `host` → `localhost:3000`. Single source of the public URL for M02/M03.
- `src/app/api/sites/[siteId]/publish/route.ts` — thin POST handler: `200 { site, slug, liveUrl }` / 401 / 404 / 422.

### M02 — Public Live Renderer (`/live/[slug]`, EN + AR first-class)
- `src/features/publishing/get-published-site.ts` — `getPublishedSiteBySlug(slug)`: **public (no session)**; `not_found` (unknown slug) / `not_live` (snapshot null OR `status!=="published"`); returns only `{ snapshot, businessInfo, siteId }` — never the editable content.
- `src/features/sites/repository.ts` — added `getSiteBySlug(slug)` (uses the unique `slug` index).
- **Root layout refactor (architectural requirement):** added `src/app/layout.tsx` (owns `<html lang="en" dir="ltr" className={fontVariables}>` + `<body>` + `./globals.css`) and refactored `src/app/[locale]/layout.tsx` into a nested layout (moved `lang`/`dir`/`mono-page` onto a wrapper `<div>`; keeps `NextIntlClientProvider` + `Navbar` + `main` + `Footer`). Required because `/live` sits outside `[locale]` and App Router allows only one html/body (the root).
- `src/app/live/layout.tsx` — minimal public shell (metadata only, NO product auth/nav chrome).
- `src/app/live/[slug]/page.tsx` — bare URL redirects to `/live/{slug}/en` (default locale); notFound if not live.
- `src/app/live/[slug]/[lang]/page.tsx` — server page rendering the published snapshot via the single `SiteRenderer` (`editMode={false}`, no edit callbacks) inside a `dir={dirFor(lang)}` wrapper (Arabic RTL first-class). Per-locale `generateMetadata` (title/description from `nav_home`/hero fields, canonical/OG via `nextUrl`). **i18n context fix:** wraps render in `NextIntlClientProvider locale={lang} messages={...}` because `/live` is outside the `[locale]` layout (without it `useTranslations` threw 500 on live pages — a real regression caught during M04 verification).
- `src/middleware.ts` — early `NextResponse.next()` for a first segment of `live`, so next-intl (`localePrefix:"always"`) does NOT locale-prefix/redirect `/live/*` (would otherwise break the bare `/live/[slug]` URL). `api`/`_next`/`_vercel`/file matcher unchanged.
- `src/features/publishing/components/LiveLocaleSwitcher.tsx` — first-class EN⇄AR switcher shown only when `activeLanguages.length > 1`; distinct absolute URLs (`/live/{slug}/ar`), current locale active/disabled, logical properties + inherits `dir`, labels from a static self-name map (EN / العربية), no stateful toggle, no editing controls.

### M03 — Publish UI (editor)
- `src/features/publishing/components/PublishControl.tsx` — dedicated client control in the editor header, visually distinct from the saved/autosave pill. Manual-click → confirmation → `POST /api/sites/[siteId]/publish`; in-flight state; success shows the live URL from the response (`publish.open_live`); disabled + hint when unpublishable; errors surfaced without crashing. Never fires from autosave/editing.
- `src/features/publishing/components/PublishControl.tsx` (Task 2 additions) — "unpublished changes" indicator shown only when `hasUnpublishedChanges && publishedSnapshot != null`, with a Re-publish strong-confirm path (`publish.republish_confirm` / `republish_btn`) that explicitly states the live version will be replaced. **Drift now reacts to in-session edits:** `EditorShell`'s `EditorContent` tracks a `userEdited` flag set on inline commit / color change / image change, feeds `hasUnpublishedChanges || userEdited` to `PublishControl`, which syncs its local `dirty` via `useEffect` and clears it on publish (`onPublished`). Never auto-publishes, never self-changes on timer.
- Wired via `src/features/editor/components/EditorShell.tsx` + `src/app/[locale]/sites/[siteId]/editor/page.tsx` (page threads `publishedSnapshot`/`hasUnpublishedChanges` down).
- `src/messages/en.json` + `src/messages/ar.json` — added `publish.*` keys (EN + exact AR): `action, confirm, confirm_btn, success, cancel, unpublishable_hint, open_live, unpublished_changes, republish_confirm, republish_btn, updated_at`.

### M04 — Unpublish + End-to-End Verification
- `src/features/publishing/unpublish-site.ts` — `unpublishSite(siteId)`: owner auth, sets `status:"unpublished"` via `updateSite`; **idempotent-safe** (harmless if already draft/unpublished); **never deletes/mutates `publishedSnapshot`** (owner can re-publish later); leaves `hasUnpublishedChanges` as-is. Returns updated DTO.
- `src/app/api/sites/[siteId]/unpublish/route.ts` — thin POST handler: `200 { site }` / 401 / 404.
- **End-to-end verification PASSED** (live, real user + real DB, both locales): safe build (lint + typecheck + build green, `/api/health` OK after restart); lifecycle smoke test publish → serve (en 200, ar 200 RTL first-class, bare redirects to /en) → edit (live still serves OLD snapshot, `hasUnpublishedChanges=true`) → re-publish (live serves new, flag false) → unpublish (en+ar 404, snapshot preserved) → re-publish (live 200). DB invariants verified: unique slug index, zero duplicate slugs, valid status transitions, snapshot preserved on unpublish, no structural-editing collection/feature introduced. **No new npm dependencies anywhere in the epic.**

## Work State

### Completed
- **All 6 epics (01–06) implemented and verified.** Epics 01–05 per prior compaction; Epic 06 (this file) completed M01–M04 including live verification.
- **Publishing/live-serving LIVE at `src/app/live/[slug]/`** plus publish/unpublish API routes and editor Publish control as above.

### Blocked / Pending (non-blocking, optional)
- **Optional production smoke test:** a full end-to-end real-AI-generation publish through the app UI on a production-deployed instance (free-tier Gemini quota may throttle; not required to declare the MVP done).
- **Optional:** a production free-tier quota throttle note (Gemini latency ~95s single-locale; timeouts fixed at 180s but quota limits may still bite under load).

## Next Move (only if continuing work)
1. Optional: production deployment + real-gen publish smoke test.
2. Optional: product polish beyond MVP (analytics, contact-form submission, custom domains) — ALL OUT OF MVP SCOPE per EPIC.md.

## Relevant Files (Epic 06)
- `src/features/publishing/{publish-site,unpublish-site,get-published-site,live-url}.ts`
- `src/features/publishing/components/{PublishControl,LiveLocaleSwitcher}.tsx`
- `src/app/api/sites/[siteId]/{publish,unpublish}/route.ts`
- `src/app/layout.tsx` (root; new) · `src/app/[locale]/layout.tsx` (nested; refactored) · `src/middleware.ts` (`/live` bypass)
- `src/app/live/{layout, [slug]/page, [slug]/[lang]/page}.tsx`
- `src/features/sites/repository.ts` (`getSiteBySlug` added)
- `src/features/editor/components/EditorShell.tsx` + `src/app/[locale]/sites/[siteId]/editor/page.tsx` (Publish control wiring)
- `src/features/sites/types.ts` (`PublishedSnapshot` — the snapshot contract, unchanged)
