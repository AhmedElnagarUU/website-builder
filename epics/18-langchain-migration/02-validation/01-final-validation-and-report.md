# Task 01 — Full Build + Runtime Checks + Native-Fetch Audit + Migration Report

## Objective
Prove the LangChain migration is behavior-preserving and ship the evidence-based report.

## Dependencies
Epic 18 M01 complete.

## Scope

### 1. Static pipeline
Run strictly in order; stop on first failure:
```
npx tsc --noEmit
npm run lint
npm run build
```
Build rule: stop any dev server first, delete `.next`, build plainly, restart via `start-dev.bat`.

### 2. Runtime spot-checks (dev server on :3001)
- `GET http://localhost:3001/api/health` → `{ "status": "ok", "db": true }`.
- `GET /en` and `GET /ar` → 200.
- Generation endpoint smoke test (no AI credentials required):
  - Identify the generation start route (`src/features/generation/api/start-generation.ts`), hit it WITHOUT a session or with an invalid body. Expected: 4xx validation/ownership/entitlement error — proves the route, repo (Mongoose), and the new `ai-config` imports all boot. A 500 signal regressions.
  - If AI credentials ARE present in the environment, optionally run one real generation to a scratch site and confirm the `{"fields":...}` content lands and `generation.status` becomes `complete`. State clearly in the report whether this was run.
- Note anything flaky about the dev server during these checks rather than hiding it.

### 3. Raw-fetch audit
- `grep -ri "fetch(" src/features/generation/` → must return zero matches (or only unrelated, non-provider `fetch` if truly unavoidable — report if so).

### 4. Migration report — `docs/05-problems/04-langchain-migration-report.md`
Structure per mission §24:
## Summary
- what was migrated (raw HTTP → LangChain)
## AI → LangChain
- providers discovered (Gemini, OpenAI-compatible/OpenRouter)
- integrations migrated (the single `generateFields` path)
- LangChain components introduced (`ChatOpenAI`, `ChatGoogleGenerativeAI`, `SystemMessage`, `HumanMessage`)
- abstraction created (`model-factory.ts` `createChatModel()`; `ai-config.ts`)
- structured-output status (preserved via `response_format` / `generationConfig` passthrough + unchanged `requireJson`)
- streaming status (N/A — not present before, not introduced)
- provider-specific coupling removed (raw fetch, per-provider request/response interfaces, URL construction)
- remaining provider-specific code (intentional: `model-factory.ts` — selection behind the boundary)
- fetchImpl seam status (OpenAI-compat honors it; Gemini support or limitation documented)
- timeout parity (OpenAI 180s via LangChain `timeout`; Gemini behavior documented)
## Files Changed
- `package.json`, `ai-client.ts`, `run-generation.ts`, new `ai-config.ts`, new `model-factory.ts`
## Validation
- actual outputs of tsc / lint / build / runtime checks (do not claim what was not run)
## Risks / Follow-up
- any behavioral deltas, provider limitation notes, future improvements (e.g. unified timeout, structured-output via `withStructuredOutput` later)
## Final Status
- exactly one of `COMPLETED` / `COMPLETED_WITH_FOLLOW_UP` / `BLOCKED`

## Acceptance criteria
- `tsc --noEmit` passes; `npm run lint` passes; `npm run build` passes.
- Health returns ok; generation route returns a clean non-500 on the no-credentials path.
- Zero raw AI `fetch` in `src/features/generation/`.
- Report written with honest validation results and final status.