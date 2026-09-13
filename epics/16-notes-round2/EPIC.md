# Epic 16 — Notes Round 2: Navbar Mobile, S3 Diagnosis, Richer Templates, Editor Live Link

## Purpose (one line)
Ship the four new items in `docs/06-notes/03-need-to-change.md`: (1) make the app navbar responsive/mobile-friendly; (2) **diagnose** the broken S3 image upload (write a problem doc, do NOT fix); (3) make template websites richer (pages have only 2–3 sections today); (4) add a live-site link with an eye icon to the editor navbar (the note's last two lines are the same story — merge them).

## Why this epic matters
Each item is a direct owner request. The diagnosis in particular is explicitly "don't fix yet" — the owner wants to know whether the S3 upload problem comes from our code or from AWS before deciding on the fix. The template-richness item addresses the product's core "AI writes your whole website" promise: findings show **5 of 10 templates ship a home page with only hero+cta (2 content sections)** and every non-home page has exactly ONE section.

## Current state (facts verified in the repo)
- **Navbar** (`src/features/shell/components/Navbar.tsx`): the only responsive class in the whole bar is `hidden md:flex` on the landing anchor cluster. The right cluster (PlanBadge, Upgrade, Dashboard, Sign out, LanguageSwitcher — 5 pills when signed-in non-Pro) always renders, never wraps, on a `justify-between` nav with no `flex-wrap`. Narrow viewports clip/overflow. No hamburger/menu exists anywhere in the app shell. Message namespace `nav.*` exists (`dashboard`, `sign_in`, `sign_up`, `sign_out`, `language_switch_label`, `upgrade`); `plan.*` for the badge.
- **Editor** (`src/features/editor/components/EditorShell.tsx`): header cluster = business name → PageTabs → saved → LanguageTabs → BrandColor → ChangeTemplate → Regenerate → `LiveStatusIndicator` (a **non-clickable** badge) → PublishControl → DeviceToggle. The editor page **does not pass `slug`** to the shell, so no `/live/…` link can be built today. Slug is created at publish time (`src/features/publishing/publish-site.ts`), live routes are `/live/[slug]` (+ `/[lang]`, `/[lang]/[pageSlug]`), and `src/features/publishing/live-url.ts` exports `nextUrl(slug)` (pure, client-safe). `publish.open_live` message key already exists ("Open live site" / "فتح الموقع المنشور"). No eye icon exists anywhere.
- **Templates** (`src/features/templates/catalog.ts` `buildPages()`): home = hero + (testimonials if `tes>0`) + cta; about/services/contact and extra pages each = exactly ONE section. All 14 `SectionType`s have renderers + demo fields already; `demoContent.ts` carries services/about/cta data for **all** templates (array-length adequate for current counts). Thin home templates: modern-studio, consultant-page, bistro-menu, simple-shop, clean-portfolio (hero+cta only).
- **S3 upload** — full pipeline mapped (see M02 task): client POSTs a ticket → server signs a presigned PUT (10 min expiry) → browser PUTs directly → PATCH records the slot. Two failure surfaces: server signing (`config_error`, `src/features/images/api/request-image-upload.ts:62`) and browser PUT rejection (`bucket_rejected`, `src/features/editor/lib/uploadImage.ts:133`). `.env` defines `S3_BUCKET/REGION/ACCESS_KEY/SECRET`; **`S3_PUBLIC_BASE_URL` is NOT set** (affects only client preview `<img src>`, not upload).

## Scope boundaries
**In:** the four milestones below. The template milestone changes **composition only** (catalog section lists) + demo-content adequacy — no new section types, no renderer work, no new pages.
**Out:** fixing the S3 upload (M02 is diagnosis only); the pending `newmodern/` reskin (hermes.md mission, untouched); Epic 15 leftovers in the tree (`newmodern/`, `07-newmodern-reskin/`, `audit-report.md`); any new npm dependency; rewriting the header/hero section components.

## Milestones (execution order)
1. **01-navbar-mobile** — Responsive app navbar: hide right cluster on small screens, add hamburger + mobile dropdown (all nav items + language switcher), RTL-safe.
2. **02-s3-upload-diagnosis** — Research only: reproduce/trace the S3 upload failure, write `docs/05-problems/02-s3-image-upload-broken.md` stating whether it is code-side, AWS-side, or both. No code fixes.
3. **03-template-section-richer** — Richer templates: home gains services + about (+ keep testimonials) so no template has fewer than 4 content sections; about/services pages gain a trailing CTA band.
4. **04-editor-live-link** — Editor navbar gains an eye-icon link that opens the live published site (new tab) whenever the site is published (merge note lines 10 + 13).

## Cross-epic dependencies
- New message keys (`nav.menu`, `nav.close`) join **both** `en.json`/`ar.json`; `publish.open_live` is reused for the editor link (no duplicate key).
- `live-url.ts` `nextUrl(slug)` is the URL builder (client-safe); the editor page must pass `site.slug` into `EditorShell`.
- `catalog.ts` `buildPages()` is code data — the M03 change is entirely inside that one function (+ `demoContent.ts` if any array is too short for the new composition; verify with the same `pick()`-duplication rule Epic 14 used).

## Product invariants (never broken)
- No structural/drag-and-drop editing; publish/edit separate; Arabic first-class RTL (menu/logic utilities only, arrows `rtl:rotate-180`).
- No new npm dependencies (CODE_RULES §4 — the eye icon is an inline SVG, no icon package).
- No hardcoded user-facing strings; API ownership 401/404; build rule (never build while dev runs; stop :3000, delete `.next`, plain build, restart, verify `/api/health`).
- The S3 problem doc is a report — it must NOT modify any code, env files, or the bucket.