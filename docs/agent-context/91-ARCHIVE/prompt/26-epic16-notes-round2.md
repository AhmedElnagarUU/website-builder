# 26 — Execute Epic 16: Notes Round 2

## ROLE
Senior full-stack engineer executing a 4-milestone epic. Implement exactly what the task files say, verify milestone by milestone, report precisely. Do not invent scope.

## OBJECTIVE
Execute every milestone in `epics/16-notes-round2/` in order: (1) responsive app navbar with mobile menu; (2) S3 upload **diagnosis only** → write `docs/05-problems/02-s3-image-upload-broken.md`, NO fixes; (3) richer template pages (composition + demo adequacy); (4) editor-header live-site link with an eye icon.

## MANDATORY READING ORDER
1. **`CODE_RULES.md`** (root) — in full, before any code.
2. **`epics/16-notes-round2/EPIC.md`** — invariants, scope, build rule.
3. Each milestone: its `MILESTONE.md`, then its task files **in task order**, read before writing code.

Nothing else. The task files contain every path, snippet, and Arabic string you need.

## MANDATORY RULES (binding)
- **Build rule:** never `npm run build` while a dev server runs. Stop the `:3000` listener first (`Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`), then `Remove-Item -Recurse .next`, then `npm run build` plainly (never piped through `Select-Object`), then restart via `start-dev.bat` and verify `/api/health` returns `{"status":"ok"}`. Dev server crashes mid-compile are expected; production build + `next start -p 3001` is the reliable path. **Do not use `$PID` in PowerShell** (reserved).
- **No new npm dependencies** (CODE_RULES §4 — the eye icon is an inline SVG; `nav.menu`/`nav.close` are message keys; `nextUrl` is imported, not reimplemented).
- **i18n/RTL:** no hardcoded user-facing strings; Arabic verbatim from the tasks; logical utilities only (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start/end`, `rtl:rotate-180`, `start-0`/`end-0`).
- **M02 is research-only:** do not modify code/.env/S3. Read-only AWS calls only (HeadBucket/GetBucketCors/GetBucketPolicy). Never write to S3.
- **M03:** `catalog.ts` `buildPages()` composition only — no new section types/pages/renderer changes; keep `buildTemplateDemo` signatures.

## EXECUTION ORDER
Milestones 01 → 02 → 03 → 04. Within each, tasks in order. After **every task**: `npx tsc --noEmit` + `npm run lint` clean. After each milestone: confirm every acceptance criterion (browser/curl evidence). Fix before moving on. After all four: run the full build rule and verify `/api/health`.

## WHAT TO RETURN
Structured report:
1. Per milestone: files touched (created/edited/deleted), message keys added/changed (EN+AR) or "none", `tsc`/`lint` codes, runtime evidence (URL checks, preview HTML counts, curl output), acceptance-criteria pass/fail.
2. M02: path of the problem doc + its one-line verdict (code / AWS / both).
3. Final: clean-build status, pass list, `/api/health`, any deviations.

## FINAL CHECKLIST
- [ ] Navbar: ≤767px hamburger + dropdown (all items incl. language) works EN+AR; ≥768px desktop layout unchanged; no horizontal overflow at 320px.
- [ ] M02 doc exists at `docs/05-problems/02-s3-image-upload-broken.md`, verdict line present, no code/env changes (git status shows no `src/**` modified by M02).
- [ ] All 10 templates' preview home shows ≥ 4 content sections (hero, services, about, [testimonials], cta); about/services pages end in CTA; no raw field-key leaks; demo arrays satisfy `pick()` counts.
- [ ] Editor header shows eye-icon live link only when published; opens `…/live/{slug}` in new tab; reuses `publish.open_live`.
- [ ] Full clean build passes; `/api/health` → `{"status":"ok"}`.
- [ ] No new npm packages.