# ROLE
Senior Solutions Engineer with full-stack and API design expertise. Pragmatic, product-minded, allergic to unwarranted complexity. You care as much about the license and the offline contract of an image pipeline as about the pixels.

# OBJECTIVE
Fix the problem documented in `docs/05-problems/01-template-images-not-business-accurate.md`: template images are real photos but **not business-accurate** (they were sourced from picsum.photos, which cannot search by topic). Switch the way our templates get images from "random photos" to **Pexels-powered, business-accurate imagery**, and make generated sites' images relate to the actual business.

Two phases:
- **Phase 1 (mandatory)** — Replace the 37 self-hosted template default images (`public/templates/real/<category>/*.webp`) with curated Pexels photos whose subjects genuinely match each template's business persona (restaurant → food, consultancy → office, shop → products, portfolio → creative work, services → the specific service). Keep the end-state invariant: images are downloaded **once by a script** and self-hosted — **never fetched at render/SSG time**.
- **Phase 2 (recommended if it fits cleanly)** — When the builder generates a site, auto-fill empty image slots with Pexels photos **related to that business** (query derived from the business's own info/category), uploaded to our S3 bucket exactly like the existing upload flow — so the owner doesn't have to source images for a good-looking site.

You execute the whole thing yourself in one session; if Phase 2 proves to be an architectural change that can't stay small and safe, implement Phase 1 fully, then stop and report Phase 2 as a documented recommendation instead of shipping half-integrated work.

# MANDATORY READING (in this order)
1. `CODE_RULES.md` — read IN FULL before writing or modifying any code. Non-negotiable.
2. `docs/05-problems/01-template-images-not-business-accurate.md` — the problem this prompt resolves, and its invariants (notably: no network fetch or new dependency **at render time**).
3. `epics/14-template-modern-redesign/01-design-audit/audit-report.md` — the per-template **business personas** (e.g. classic-services = home services firm, warm-kitchen = seasonal home-style restaurant, product-focus = single-product brand, professional-profile = executive coaching, consultant-page = strategy/finance, clean-portfolio/visual-showcase = design/photography). Your search queries are derived from these, not from generic category labels.
4. **Pexels API docs — RESEARCH FIRST, via web search.** Use web search + WebFetch on the official documentation (https://www.pexels.com/api/documentation/) to learn the real API before writing a single request: the `Authorization` header format, `GET /v1/search` endpoint, response shape (`photos[]` with `src.medium` / `src.large` / `src.original` and URL size/fit/crop query parameters), pagination/`per_page`, rate limits (free default ~200 requests/hour), valid query tips, and the **license terms** (commercial use, attribution requirements or not — record exactly what the docs say).

Do not look for a PRD. This prompt is self-contained; re-read the cited files if something is ambiguous. Only escalate if a file contradicts itself.

# WORK CONTEXT (binding)
- Repo root: `C:\Users\ahmed\OneDrive\Desktop\website-version2`. OS: Windows. Shell: PowerShell 5.1. Stack: Next.js 15 (App Router), Tailwind v4, next-intl (EN/AR RTL first-class), MongoDB, S3 (`@aws-sdk/client-s3` **is** on the approved dependency list).
- **API key:** `PEXELS_API_KEY` is already set in `.env` and its placeholder (`apikeyfrompexels`) already exists in `.env.example` line 32. The real key must never be committed, logged, or serialized into client bundles. Read it only server-side via `process.env.PEXELS_API_KEY` in scripts/route-handlers. `PEXELS_API_KEY` is NOT a `NEXT_PUBLIC_` var — never expose it to the browser.
- **Current image pipeline (know before changing anything):**
  - `src/features/templates/types.ts` — `ImageSlot { slotId, aspectRatio: "1:1"|"16:9"|"4:3", minWidth, minHeight, defaultAsset }`.
  - `src/features/templates/catalog.ts` — section builders construct `ImageSlot`s; line ~81 builds `defaultAsset: \`/templates/real/${category}/${file}\`` with file names `logo.webp`, `hero.webp`, `gallery_N.webp`, `team_N.webp`, `menu.webp`. These string literals are the only filename references — if you change formats, update them consistently.
  - `src/shared/site-render/internals.tsx` `SlotImage` — image resolution order: user-uploaded S3 key (preview `s3://` form or `${s3PublicBaseUrl}/${s3Key}`) → falls back to `defaultAsset`. Do NOT change this order or the editor's tap-to-fill affordance.
  - Current assets: `public/templates/real/{services,restaurant,retail,professional,portfolio}/` — 37 webp files total (logo, hero, gallery_1..N, team_1..3, menu under restaurant). Previews (Epic 13 `/preview/<id>`), the editor, and published sites all fall back to these defaults, so replacing them upgrades every surface at once. **No other code references these files by name** (thumbnails use `preview.svg`; screenshots are `screenshot.png`).
- **Persona → subject mapping (seed, refine from the audit report):** services = the specific trade, restaurant = food/kitchen/dining, retail = products/store, professional = office/consulting/portrait, portfolio = creative work/galleries/studio. Deep-surface templates (modern-studio, consultant-page, visual-showcase) will sit on a dark surface — prefer moody images with solid mid-tones; light templates prefer bright, airy shots.
- **Verification surface:** `/preview/<template-id>` and subpages (dev must be restarted per the build rule before smoke).

# NON-NEGOTIABLE CONSTRAINTS
- **No new npm dependencies** without human approval (CODE_RULES §4). Phase 1's script uses Node's built-in `fetch`, `fs`, and `path` only — verify the project's Node ≥ 18 so global `fetch` exists. If you ever believe a package is truly required, STOP and flag it instead of installing.
- **No runtime/SSG network fetch** for template defaults. Phase 1 images are fetched only inside the sourcing script and stored under `public/templates/real/` (or a new per-template folder if you add one — see below). Previews are SSG; runtime fetching would break the build and the problem doc's invariant.
- **Keep the `ImageSlot` contract**: every replacement image must satisfy the slot's `minWidth`/`minHeight` and `aspectRatio`. Request exact crop sizes from Pexels (`?w=…&h=…&fit=crop` style params per the docs) matching each slot; never store an image smaller than the slot minimum.
- **Choose and document one of two layouts, then execute it consistently** (state your choice in the return report):
  1. **Keep shared category folders** — replace existing files in place, same names. Simple, zero catalog changes; accuracy is at category level. OR
  2. **Per-template folders** (e.g. `public/templates/<id>/real/…` or a new `<category>/<template-id>/` tree) — top accuracy per business persona, requires updating `defaultAsset` builders in `catalog.ts` to take the template id (data-level change only; contract of `ImageSlot.defaultAsset` as a string stays). This is the recommended choice for real business-related imagery given the Epic-14 personas. If you choose it, keep a small mapping/registry of template → asset folder so nothing is magic strings all over the codebase (one central place in `catalog.ts`, KISS).
- **Format is your call but must be consistent**: Pexels returns JPEG/PNG. You may keep `.webp` only if you actually re-encode (you may NOT add an encoder dependency); otherwise rename to a truthful extension and update every `defaultAsset` literal. No "server says webp but the bytes are jpeg" games.
- **Avoid text-in-image and watermark traps**: no menu boards/signage with English text for restaurant shots (an Arabic site may ship with it), no logos/trademarks. Prefer subjects, not screenshots.
- **Pexels license**: follow the docs precisely. Typical free-tier terms allow commercial use without attribution — still record the license/citation line the docs require (if any) in a `NOTE` at the top of the script and in the return report.
- Do not modify `SlotImage`, the S3 resolution order, the upload UI, `SiteRenderer`, or i18n. Phase 2 reuse is server-side S3 PUT via the existing `@aws-sdk/client-s3` in `src/features/images/` — no browser presigned changes.
- **No hardcoded user-facing strings**; new app strings need both `src/messages/en.json` and `ar.json`.

# THE TASKS
1. **Research** (mandatory before coding): web-search + WebFetch the official Pexels API docs; extract the exact auth header format, search endpoint + params, real response shape, URL sizing/cropping syntax, rate limits, and license terms. Record the essentials in the return report.
2. **Phase 1 — machine-generated sourcing script** (commit it, e.g. `scripts/fetch-template-images.mjs`):
   - Define the complete mapping: for each of the 5 categories (and per chosen layout, each template) an explicit set of search queries per asset: `logo`, `hero`, `gallery_N`, `team_N`, `menu` (restaurant), grounded in the audit personas. Aim for: hero = the single most representative subject of that business's category/persona; gallery = variety within the subject; team = human, professional, diverse; logo = a clean object/monogram-friendly subject (NOT a brand).
   - For each image: search, pick the best result deterministically (document your picking rule — e.g. first result whose dimensions ≥ slot min after requesting the exact crop), download with the slot-appropriate orientation/size, save under the chosen layout paths with the chosen extension, and **verify on disk** the resulting width×height ≥ the slot's min (real check, not the URL's word).
   - Robustness: handle rate limits (backoff/queue), resume/idempotency, network errors (retry a bounded number of times), and a `--dry-run` mode that only prints what it would fetch without writing. Never put the key in the code — only `process.env.PEXELS_API_KEY`.
   - Add `PEXELS_API_KEY=` to `.env.example` only if missing (it already exists — leave it).
3. **Apply**: run the script, replace the old files, update `catalog.ts` `defaultAsset` builders per the chosen layout (if per-template). Remove or archive anything the old pipeline left unused. Re-run and verify previews render the new images with correct aspect (no distortion, no blank `SlotImage` fallback to raw path).
4. **Phase 2 — generation-time business-accurate images (only if it stays clean)**:
   - Where a generated site has empty image slots, call Pexels search server-side with a query derived from `businessInfo` (category + a couple of keywords from the business name/description), choose the best match per slot type, download/upload to S3 (`sites/{siteId}/{slotId}/pexels/{uuid}.{ext}` key pattern fits the existing convention), and insert the resulting `s3:`/public URL into the site's images so the published site shows business-related photos the owner can still replace.
   - Reuse `src/features/images/` S3 client. Respect rate limits (cache per query; reuse across slots). Keep the existing upload flow untouched.
   - If this requires touching generation orchestration (e.g. `src/features/generation/**`) in a way that can't stay small, DON'T do it — write the design as a short section in the return report (files to touch, API to add, edge cases) instead.
5. **Close out**: update `docs/05-problems/01-template-images-not-business-accurate.md` with a short "Resolution" section at the top (what changed, license, how to re-run the script) so the doc no longer reads as open; keep the gitignored status of `.env` (real key never committed).

# VERIFICATION (run before declaring done)
1. `npx tsc --noEmit` → exit 0.
2. `npm run lint` → no errors (pre-existing warnings in `src/features/monetization` are acceptable).
3. Build rule is MANDATORY: NEVER `npm run build` while a dev server runs (shared `.next`). Stop dev (kill the :3000 listener; use a plain variable for the PID — never `$PID`), delete `.next`, run `npm run build` PLAINLY (never piped through `Select-Object`; `Retrying`/swc spam is harmless), start dev via `start-dev.bat`, verify `http://localhost:3000/api/health` → `{"status":"ok"}`.
4. Runtime: `/preview/<id>` (one per category/family, incl. a deep-surface template) → 200 and the hero/images on the page resolve 200 via `/templates/real/...` (or the chosen layout path) at correct intrinsic sizes; no `?` empty-image fallback appearing in the rendered markup.
5. Grep checks: zero leftover `picsum`, `source.unsplash`, `loremflickr` references in `src/` and `scripts/`; `git grep "PEXELS_API_KEY"` (or equivalent) shows the placeholder only in `.env.example` (and never a real key); extension/format consistent with `defaultAsset` paths.
6. If Phase 2 was implemented: end-to-end smoke of the generation flow (create → generate → images exist in S3 with `pexels` keys → site preview shows them) and document rate-limit behavior.

# WHAT TO RETURN (final message)
- **Research digest**: the Pexels API essentials you will rely on (auth header, endpoint, params, response shape, URL crop syntax, rate limits, license) — with the doc URL you verified against.
- **Chosen layout** (shared-category vs per-template) and the full mapping table: template/category → asset → Pexels query → chosen photo URL → saved path + verified width×height ≥ slot min.
- **Phase 1 evidence**: script path, `--dry-run` sample output, files created/replaced, catalog diff if any, verification suite results (tsc/lint/build tail/health) + the exact preview routes smoke-checked with statuses.
- **Phase 2 status**: implemented (with evidence) or design-only (with the written design), and your honest recommendation.
- **License**: exact terms from the docs as recorded in the script.
- **Files changed** (full list) and the `.env.example` note.
- **"Needs a human eye"**: any image I could only verify programmatically (subjectiveness of "well-matched photo", visual quality on dark surfaces) that warrants a quick human look.
- **Deviations** from this prompt, with reasons.