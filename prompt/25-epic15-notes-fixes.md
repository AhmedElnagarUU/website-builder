# 25 — Execute Epic 15: Notes-Fixes

## ROLE
You are a senior full-stack engineer executing a sequential epic. You implement exactly what the task files say, verify every milestone, and report precisely. Do not invent scope.

## OBJECTIVE
Implement all 5 milestones in Epic 15 (`epics/15-notes-fixes/`), one milestone at a time, task by task. The epic solves 5 items the owner requested in `docs/06-notes/03-need-to-change.md`. Every change is a small, self-contained, reviewable unit.

---

## MANDATORY READING ORDER

1. **`CODE_RULES.md`** (the root file) — non-negotiable, in full, before touching any file.
2. **`epics/15-notes-fixes/EPIC.md`** — epic-level invariants, scope boundaries, verification/build rules.
3. As you begin each milestone, read its `MILESTONE.md` then its task files **in task order** before writing any code.

Do not read anything else unless a task file explicitly tells you to (e.g. "read this before editing"). The task files contain every required path, before/after snippet, and Arabic message key — you need nothing outside them.

---

## MANDATORY RULES (binding, never broken)

### Build rule (verbatim)
> Never `npm run build` while a dev server is running.
>
> Stop the `:3000` PowerShell listener first (`Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`), then delete `.next`, run `npm run build` plainly (never piped through `Select-Object`), restart dev, and verify `/api/health` returns `{"status":"ok"}`.

Dev server crash-prone during heavy compiles is expected — production builds / `next start -p 3001` are the reliable verification path. On Windows PowerShell never use `$PID` (it is a reserved automatic variable).

### No new npm dependencies
CODE_RULES §4 — every approved package is listed there. Nothing else goes in.

### i18n / RTL
All new user-facing text goes through `next-intl` with EN **and** AR keys (Arabic verbatim from the task files). Layout-critical CSS uses logical utilities only (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `start-0`, `end-0`); directional classes never.

### API ownership
Every owner-scoped endpoint returns 401 (no session) or 404 (not owner) — never 403.

### No hardcoded strings
CODE_RULES §6 — never invent labels; use message keys or the literal Arabic values provided.

---

## TASK EXECUTION ORDER

Work through the milestones in order (1 → 2 → 3 → 4 → 5). Within each milestone, execute its tasks in the numbered order inside that milestone's `MILESTONE.md`. Do not skip ahead.

**Before each task:**
1. Read the task file.
2. Read any source file it tells you to read.
3. Implement exactly the scope described (do not expand, do not "while you're in there" refactor).
4. Run `npx tsc --noEmit` + `npm run lint` **after every individual task** — do not accumulate failures.

**After each milestone:**
- Confirm every acceptance criterion in that milestone's task files is met (spot-check with browser or `curl` for APIs/pages).
- Confirm no message keys or imports were missed.
- Fix any failures before proceeding to the next milestone.

**After all 5 milestones are done:**
- Run the full build rule: stop port 3000 → `Remove-Item -Recurse .next` → `npm run build` (plain, never piped) → restart via `start-dev.bat` → `curl http://localhost:3000/api/health` → confirm `{"status":"ok"}`.
- Verify the milestone list acceptance criteria in `05-remove-super-admin/MILESTONE.md` (grep for admin remnants, 404 on `/en/admin` and a sample admin API, `AccountStatus` intact).

---

## WHAT TO RETURN (single final message)

Return a structured report with:

1. **Per milestone:**
   - Files created/edited/deleted (exact paths).
   - Message keys added (namespace + EN/AR values, or "no new keys").
   - `tsc` + `lint` exit codes.
   - Any build/runtime verification evidence (curl output, browser evidence, grep output).
   - Pass/Fail against each task's Acceptance Criteria.

2. **Overall final state:**
   - `tsc --noEmit` exit code.
   - `npm run lint` exit code.
   - Build rule completion: did the clean build pass? What routes appeared?
   - `/api/health` response.
   - Remaining admin grep: `SuperAdmin|AdminRole|requireAdmin|isAdmin|getAdminRole|super_admin` in `src/` — should be zero.

3. **Any deviations** from the task files and why.

---

## FINAL CHECKLIST (confirm each before submitting report)

- [ ] M01: Navbar shows "Upgrade" only for non-Pro signed-in users; `/en/pricing` and `/ar/pricing` render, both locales correct.
- [ ] M02: DELETE returns 401/404/200 correctly; delete dialog blocks until exact site name typed; card disappears after refresh.
- [ ] M03: All language labels show `ar`/`en` codes; no full language names remain in app UI.
- [ ] M04: `/en/privacy`, `/ar/privacy`, `/en/terms`, `/ar/terms` render; every footer link navigates to a real target; no `href="#"` in `Footer.tsx`.
- [ ] M05: `/en/admin` → 404; `admin` namespace gone from messages; `AdminRole`/`super_admin`/`requireAdmin` absent from `src/`; `AccountStatus`/`getAccountStatus` preserved; Epic 12 artifacts untouched.
- [ ] Full clean build passes; `/api/health` returns `{"status":"ok"}`.
- [ ] No new npm packages added.