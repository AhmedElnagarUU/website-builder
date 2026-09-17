# Task 01 — Final validation and report for Epic 23

## Context
Epic 23 M06 is the Definition of Done gate. Previously completed tasks (M01–M05) are assumed merged into the working tree. Run the full validation checklist and produce the report. **Do not modify feature code** — you may only fix trivial issues you introduced, and the report is the deliverable.

Read before starting (mandatory order): `CODE_RULES.md` → this task → parent `epics/23-paymob-payments/06-validation/MILESTONE.md` → skim the epic EPIC.md for intent.

## Deliverables
1. Run every item in MILESTONE `Checklist` (§1–§4), recording results.
2. Write `docs/05-problems/05-paymob-integration-report.md` with MILESTONE §5 structure.
3. Report back with: pass/fail per checklist item + any deviations found + honest "not tested" list.

## Environment notes (Windows / PowerShell)
- Dev server runs on :3000 (check `start-dev.bat`). Build rule: kill dev server (`Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'next dev' }` → stop PID — do NOT use `$PID`), `Remove-Item -Recurse -Force .next`, run `npm run build` **plainly** (no pipes), then restart via `start-dev.bat`. If `next/font` times out, `NODE_OPTIONS=--dns-result-order=ipv4first` first. Verify `/api/health` → `{"status":"ok"}`.
- MongoDB must be reachable for runtime smoke (check `mongosh`/dev logs). If DB is down, mark runtime items "not run — DB unreachable" honestly.
- For runtime stubs, scripts go under the OS temp dir (`$env:TEMP`), never into the repo.

## Verification of security greps — exact commands
```
rg -ni "PAYMOB_SECRET_KEY" src/
rg -ni "PAYMOB_HMAC_SECRET" src/
rg -ni "NEXT_PUBLIC_PAYMOB" src/
rg -n "from \"mongodb\"" src/features/payments
rg -niE "billing_data|special_reference" src/ | grep -v node_modules
```
Record exact outputs in the report.

## Acceptance Criteria
- Report file exists and is truthful (no claim of a live-Paymob test that wasn't run).
- If a checklist item fails, the report says so with the failing command/output, and the epic is reported NOT complete until fixed (or genuinely documented as acceptable deviation with rationale).
- Final message to the user lists: exact pass/fail summary, files created/modified, and remaining work.