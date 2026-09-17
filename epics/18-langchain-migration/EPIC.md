# Epic 18 — Raw AI API Calls → LangChain

## Purpose (one line)
Replace the hand-rolled `fetch`-based AI HTTP client with LangChain chat-model abstractions, establishing a provider-independent AI integration boundary — while preserving every aspect of existing behavior: prompts, structured-output contract, error classes, timeout, and the field-level retry flow.

## Why this epic matters
The current AI client (`src/features/generation/lib/ai-client.ts`, 193 lines) manually builds two completely different HTTP request shapes (OpenAI-compatible `/chat/completions` and Gemini `:generateContent`), performs its own response parsing, status handling, and error classification. Adding a provider or swapping a model means touching request/response plumbing. LangChain provides a stable abstraction: configure a chat model by provider + name, invoke it with `SystemMessage`/`HumanMessage`, receive content back — without knowing the HTTP details. This is the mission's **Epic B — Raw AI API Integrations → LangChain**, whose goal is a maintainable AI boundary with reduced provider coupling.

## Current state (facts verified in the repo)
- **Single integration point:** `src/features/generation/lib/ai-client.ts`, one exported function `generateFields(messages, config): Promise<ParsedFields>`.
- **Two providers** selected at runtime by `getAiConfig()` in `src/features/generation/run-generation.ts`:
  - **Gemini** — active when `GEMINI_KEY` env is set: `baseUrl = process.env.AI_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"`, `model = "gemini-3.6-flash"`, structured output via `responseMimeType: "application/json"`, API key in query (`?key=`).
  - **OpenAI-compatible** (fallback; OpenRouter etc.) — `AI_API_BASE_URL`, `apiKey = OPENROUTER_API_KEY || AI_API_KEY`, `model = AI_MODEL`, structured output via `response_format: { type: "json_object" }`, plus optional `HTTP-Referer` (`NEXT_PUBLIC_APP_URL`) and `X-Title` (`AI_APP_NAME || "Monomastic"`) headers.
- **Model parameters:** `temperature: 0.7` hardcoded; timeout `TIMEOUT_MS = 180_000` via `AbortController`; no retries at the client level (retry is a field-level loop in `run-generation.ts`); response expected as `{"fields": {...}}` JSON.
- **Parsing:** `requireJson()` strips markdown fences (`stripFences`), parses JSON, and validates a `fields` key exists that maps strings → `ParsedFields`. Throws `BadResponseError` on malformed output.
- **Error classes** (`src/features/generation/types.ts`): `BadResponseError`, `TimeoutError`, `ProviderError`. `classifyError()` in `run-generation.ts` maps `name` → `"timeout" | "bad_response" | "provider_error"`.
- **Prompts:** `prompt-builder.ts` produces `{ system, user }`; passed verbatim. The retry flow in `validation` (`field-validation.ts`) builds a sub-prompt for a failing field and calls `generateFields` again.
- **`fetchImpl` injection seam:** `config.fetchImpl` (defaults to global fetch) exists for offline testing. Preserve it where LangChain supports it (OpenAI branch); otherwise document.
- **No streaming, no embeddings, no tool/function calling, no memory/agents** anywhere.
- **Config shape today:** `AiConfig { baseUrl, apiKey, model, extraHeaders?, useStructuredOutput? }` defined in `run-generation.ts`.

## Design decisions (binding, embedded in tasks)
1. **Minimal LangChain surface** — only `ChatOpenAI` (OpenAI-compatible) + `ChatGoogleGenerativeAI` (Gemini), message types `SystemMessage`/`HumanMessage`. No chains, agents, memory, tools, retrievers, or embedding models.
2. **Structured output preserved via request-format passthrough, NOT `.withStructuredOutput()`** — `.withStructuredOutput()` reprograms the request (tool-calling / JSON-schema) and can alter model behavior. Instead pass the same format knobs the app currently uses: OpenAI branch `.bind({ response_format: { type: "json_object" } })`; Gemini branch `generationConfig: { responseMimeType: "application/json" }` in the constructor. The response `content` string is parsed by the SAME `requireJson()`.
3. **Prompts unchanged** — the `system`/`user` strings flow verbatim; do not rewrite `prompt-builder.ts` or the retry sub-prompts.
4. **Error mapping** — wrap `model.invoke` in try/catch; treat timeout/abort-like errors as `TimeoutError`, everything else as `ProviderError`; keep `BadResponseError` for parse failures. Keeps `classifyError()` semantics intact.
5. **`maxRetries: 0`** — LangChain defaults to retrying; the app already has its own field-level retry. Disable LangChain retries to preserve behavior.
6. **Config + provider selection centralized** — move `getAiConfig()` + `classifyError()` + `AiConfig` to `src/features/generation/lib/ai-config.ts`; add a `provider` discriminator (`"gemini" | "openai-compat"`) so the model factory picks the right LangChain class without re-detecting via URL.
7. **`fetchImpl` seam** — OpenAI branch supports `configuration: { fetch: customFetch }`. Gemini branch: attempt to preserve if supported; otherwise document that the seam applies to the OpenAI-compatible path only. This seam mirrors the current testability without introducing a test framework (per human decision: **no automated unit tests**).
8. **Two independent migrations** — Epic 17 (Mongoose) does not touch `features/generation/**`; this epic does not touch DB code.
9. **Env var names unchanged** — `GEMINI_KEY`, `AI_GEMINI_BASE_URL`, `AI_API_BASE_URL`, `AI_API_KEY`, `OPENROUTER_API_KEY`, `AI_MODEL`, `NEXT_PUBLIC_APP_URL`, `AI_APP_NAME`.

## Scope boundaries
**In:** install `langchain`, `@langchain/openai`, `@langchain/google-genai` (approved); create `ai-config.ts` and `model-factory.ts`; rewrite `ai-client.ts` internals (exported signature unchanged); update imports in `run-generation.ts`; migration report.
**Out:** changing prompts or the `ParsedFields`/`{"fields":...}` contract; adding streaming/embeddings/tools; changing env names; touching other features (Monetization/sites/etc. belong to Epic 17); adding a test framework; the Pexels pipeline; the `newmodern/` reskin.

## Milestones (execution order)
1. **01-integrate-langchain** — Install deps, create `ai-config.ts` + `model-factory.ts`, rewrite `ai-client.ts`, rewire `run-generation.ts`.
2. **02-validation** — Full tsc + lint + build, runtime generation spot-check, native-fetch audit, migration report.

## Cross-epic dependencies
- None on Epic 17 at the code level. Execution is sequential only to keep one `npm run build` at a time.
- `features/generation/lib/field-validation.ts` calls `generateFields` for the retry path — keep `generateFields`' signature identical or it breaks.

## Product invariants (never broken)
- Existing prompts and the `{"fields":{...}}` output contract are preserved exactly.
- `BadResponseError` / `TimeoutError` / `ProviderError` thrown in the same scenarios; `classifyError()` unchanged.
- Generation flow (queue → poll → merge) behaves identically on success/failure.
- Secrets stay server-side only; no new env vars; no hardcoded UI strings.
- Build rule: stop dev server before build; delete `.next`; plain build; restart; verify `/api/health`.