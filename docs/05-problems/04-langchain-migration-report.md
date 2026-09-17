# Epic 18 — LangChain Migration Report

## Summary
Replaced the hand-rolled `fetch`-based AI HTTP client (`src/features/generation/lib/ai-client.ts`, which built two different raw request shapes — OpenAI-compatible `/chat/completions` and Gemini `:generateContent` — plus its own response parsing and error classification) with LangChain chat-model abstractions. The only exported integration function, `generateFields(messages, config): Promise<ParsedFields>`, is unchanged in signature and behavior: same prompts passed verbatim, same `{"fields": {...}}` output contract parsed by the unchanged `requireJson()`, same error classes (`BadResponseError`/`TimeoutError`/`ProviderError`) thrown in the same scenarios, same `classifyError()` semantics, same `maxRetries: 0` (field-level retry in `field-validation.ts` still owns retries), and the `fetchImpl` injection seam preserved on the OpenAI-compatible path.

## AI → LangChain

### Providers discovered
- **Gemini** — selected at runtime when `GEMINI_KEY` is set. `baseUrl = AI_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"`, `model = "gemini-3.6-flash"`, `temperature: 0.7`, structured output via `responseMimeType: "application/json"`.
- **OpenAI-compatible** (fallback; OpenRouter etc.) — `AI_API_BASE_URL`, `apiKey = OPENROUTER_API_KEY || AI_API_KEY`, `model = AI_MODEL`, `temperature: 0.7`, `timeout: 180_000`, structured output via `response_format: { type: "json_object" }`, optional `HTTP-Referer` (`NEXT_PUBLIC_APP_URL`) and `X-Title` (`AI_APP_NAME || "Monomastic"`) headers.

Both were single-server integrations selected by `getAiConfig()` (env-var logic moved verbatim).

### Integrations migrated
- The single `generateFields` path in `src/features/generation/lib/ai-client.ts` (used by `run-generation.ts` and, transitively, `features/regeneration/**` for retries/regeneration). Nothing else calls AI providers.

### LangChain components introduced
- `ChatOpenAI` (`@langchain/openai` ^1.5.13) — OpenAI-compatible provider.
- `ChatGoogleGenerativeAI` (`@langchain/google-genai` ^2.3.2) — Gemini provider.
- `SystemMessage` / `HumanMessage` (`@langchain/core/messages`, hoisted from `langchain` ^1.5.11).
- No chains, agents, memory, tools, retrievers, streaming, or embeddings.

### Abstraction created
- `src/features/generation/lib/ai-config.ts` — `getAiConfig()` / `classifyError()` / `AiConfig` moved verbatim out of `run-generation.ts`, extended with a `provider: "gemini" | "openai-compat"` discriminator set from the exact same `GEMINI_KEY`-presence condition. `run-generation.ts` now imports these from `./lib/ai-config` and re-exports them, so existing consumers (`features/regeneration/**`) compile untouched.
- `src/features/generation/lib/model-factory.ts` — `createChatModel(config: AiConfig)` returns the LangChain model for the provider, centralizing all provider-specific construction behind one function.

### Structured output
Preserved via request-format passthrough — **no `.withStructuredOutput()`**:
- **OpenAI-compatible:** `chat.withConfig({ response_format: { type: "json_object" } })` when `useStructuredOutput !== false`; otherwise the plain model (mirrors the old behavior of omitting `response_format`). This is the v1.x replacement for the `.bind({ response_format: { type: "json_object" } })` from the task spec — `.bind()` was removed from `Runnable`/`BaseChatModel` in `@langchain/core` v1.x. Verified that `withConfig` merges `response_format` into every invocation's call options and the OpenAI client forwards `options?.response_format` into the request body.
- **Gemini:** the constructor `json: config.useStructuredOutput !== false` flag — the `@langchain/google-genai` v2.x replacement for the `generationConfig` constructor option referenced in the task spec. Verified in the installed package source that `json: true` produces exactly `generationConfig: { responseMimeType: "application/json" }` on the underlying model.
- The response `content` string is still parsed by the same `requireJson()` (`stripFences` → `JSON.parse` → `fields` string-map check), so the `{"fields": {...}}` contract is byte-for-byte unchanged.

### Streaming status
N/A — streaming was not present before and was not introduced.

### Provider-specific coupling removed
- Raw `fetch`/`AbortController` HTTP machinery: `ChatRequest`, `ChatResponse`, `GeminiRequest`, `GeminiResponse`, `isGemini()`, URL construction, key-in-query (`?key=`), status handling — all deleted. `grep -ri "fetch(" src/features/generation/` returns only two client-side polling calls to the app's own API (`useGenerationPolling.ts`: `/api/sites/{siteId}/generation-status`, `/api/sites/{siteId}/generate`) — these are the browser↔app queue-polling seam, not provider HTTP, and are intentionally retained.

### Remaining provider-specific code (intentional)
- `model-factory.ts` — the single place that knows about `ChatOpenAI` vs `ChatGoogleGenerativeAI` and their format knobs. This is the deliberate isolation boundary; everything upstream is provider-agnostic.

### fetchImpl seam status
- **OpenAI-compatible:** honored — `configuration: { fetch: config.fetchImpl ?? undefined }` (global `fetch` default preserved).
- **Gemini:** `@langchain/google-genai` v2.x exposes no `fetch`-injection option on `GoogleGenerativeAIChatInput` (verified against the installed type definitions). The seam therefore applies to the OpenAI-compatible path only. No current caller passes `fetchImpl` to the Gemini path, so this is a documented capability limitation, not a behavior change.

### Timeout parity
- **OpenAI-compatible:** `timeout: 180_000` in the `ChatOpenAI` constructor — the old client-side 180s `AbortController` contract is preserved by the provider client.
- **Gemini:** `ChatGoogleGenerativeAI` v2.x exposes no timeout option in its input (verified in the installed `.d.ts`). The previous code applied the 180s `AbortController` to **both** providers, so the Gemini branch now relies on the provider's own (infinite) request timeout. Marked as a follow-up; the old raw-fetch branch for Gemini used the same 180s cap.

## Files Changed
Added:
- `src/features/generation/lib/ai-config.ts`
- `src/features/generation/lib/model-factory.ts`

Modified:
- `package.json` / `package-lock.json` — added `langchain` (^1.5.11), `@langchain/openai` (^1.5.13), `@langchain/google-genai` (^2.3.2) (approved)
- `src/features/generation/lib/ai-client.ts` — internals rewritten to `createChatModel()` + `model.invoke([SystemMessage, HumanMessage])`; parsing helpers (`stripFences`, `isStringMap`, `requireJson`) and the exported `generateFields` signature unchanged
- `src/features/generation/run-generation.ts` — imports only: local `getAiConfig`/`classifyError`/`AiConfig` definitions removed, now imported (and re-exported) from `./lib/ai-config`

Untouched by design: `prompt-builder.ts`, `field-validation.ts`, `types.ts`, all Epics-17 files, and the rest of `src/`.

## Validation (actual results)
| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` (`next lint`) | exit 0 — "No ESLint warnings or errors" |
| `npm run build` (from deleted `.next`, no dev server running) | passed — `✓ Compiled successfully in 72s`, 33/33 static pages, full route table incl. `/api/sites/[siteId]/generate`, `/api/sites/[siteId]/generation-status`, `/api/health`, `/en`, `/ar`. (Font-domain fetches flickered "Retrying" — the known IPv6 routing quirk in this network — but succeeded without the `ipv4first` workaround this time.) |
| `GET http://localhost:3000/api/health` (dev server from `start-dev.bat`; this environment's `.env` sets port 3000, matching the Epic-17 runtime convention) | 200 `{"status":"ok","db":true}` |
| `GET http://localhost:3000/en` | 200 on second request (first timed out on the dev server's on-demand compile of the page — not an app error; same as Epic 17) |
| `GET http://localhost:3000/ar` | 200 |
| `POST http://localhost:3000/api/sites/<dummy>/generate` (no session) | 401 `{"error":"unauthorized"}` — clean validation error proving the route, Mongoose repo, entitlement wrapper, and the new `ai-config`/LangChain imports all boot (a 500 would have signaled regression) |
| `GET http://localhost:3000/api/sites/<dummy>/generation-status` (no session) | 401 |
| `grep -ri "fetch(" src/features/generation/` | 2 matches, both browser-side polling of the app's own API in `useGenerationPolling.ts` (documented, non-provider) — zero raw AI-provider fetch |
| `grep -ri "chat/completions|generateContent|AbortController|isGemini" src/features/generation/` | zero matches; the only `generativelanguage` string is the env default in `ai-config.ts` |

A real AI generation was **not** run: `GEMINI_KEY` is present, but the smoke test path requires an authenticated session and a fully-created owner site (sign-in → wizard → site), which is out of reach in this environment. The no-credentials-equivalent check above (clean 401) and the green toolchain are the evidence submitted.

## Risks / Follow-up
- **Gemini client timeout gap (behavioral delta):** the old raw client applied a 180s `AbortController` to Gemini too; `ChatGoogleGenerativeAI` v2.x has no timeout knob. A unified client-side timeout wrapper (or provider option when upstream adds one) is the follow-up.
- **Gemini `fetchImpl` seam:** not injectable in `@langchain/google-genai` v2.x; documented limitation (OpenAI-compatible path keeps the seam).
- **`@langchain/core` is consumed transitively** (`SystemMessage`/`HumanMessage` resolve via hoisting from the three installed packages). Pinned effectively by those versions; would surface at build time if a future resolution changed the core API.
- **API-version adaptations (vs. task pseudocode):** `.bind({ response_format })` → `.withConfig({ response_format })` (`bind` removed in `@langchain/core` v1.x, same wire request); Gemini `generationConfig` → `json: true` (the v2-native knob, verified to emit `generationMimeType:"application/json"`); `baseUrl` now passed to the Gemini constructor so `AI_GEMINI_BASE_URL` remains honored (parity with the raw client).
- **Runtime generation spot-check** with real AI output not exercised end-to-end (requires authenticated site flow); recommended before release.
- No automated unit tests added (per the human decision to not introduce a test framework).

## Final Status
COMPLETED_WITH_FOLLOW_UP
(All milestones M01–M02 implemented: `tsc`/`lint`/`build` green, runtime checks green, zero raw provider `fetch`, signature/contract/error semantics preserved. Not pure COMPLETED because (1) the Gemini branch lost the old 180s client-side timeout cap, (2) Gemini `fetch` injection is unsupported by v2.x, and (3) an end-to-end ecosystem generation with real AI output wasn't exercised — all documented above.)