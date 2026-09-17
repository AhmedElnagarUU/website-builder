# Milestone 02 — Final Validation + Migration Report

## Goal
Run the complete verification pipeline (tsc + lint + build) and runtime spot-checks to confirm AI generation works through the new LangChain abstraction, then write the migration report per mission §24.

## Tasks (execution order)
1. **01-final-validation-and-report.md** — build + runtime checks + native-fetch audit + report.

## Shared context (binding for this milestone)
- M01 must be complete (deps installed, client rewritten, factory + config in place).
- Build rule: stop any dev server on :3000/:3001 → delete `.next` → run `npm run build` plainly (never piped) → restart via `start-dev.bat` → verify `GET http://localhost:3001/api/health`.
- Runtime generation spot-check must NOT require real AI credentials: if `GEMINI_KEY`/`AI_API_KEY` are unset, asserting the route returns a clean validation error (4xx, not 500) still proves the LangChain model factory and error path are wired. Do not fabricate a successful generation without credentials.

## Verification (end of milestone)
- `tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Health returns `{ "status": "ok", "db": true }`.
- No raw `fetch(` remains in `src/features/generation/`.
- Report written with honest evidence and a clean final status.