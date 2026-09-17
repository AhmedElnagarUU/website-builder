# Milestone 01 — Integrate LangChain Model Abstraction

## Goal
Install the approved LangChain packages, centralize AI/provider configuration in `features/generation/lib/ai-config.ts`, add a model factory (`model-factory.ts`) that returns the correct LangChain chat model per provider, and rewrite `ai-client.ts` so `generateFields` invokes the model via LangChain — preserving its exported signature, output contract, timeout, and error classes.

## Tasks (execution order)
1. **01-create-model-factory-and-migrate-ai-client.md** — install + config module + factory + client rewrite + run-generation rewire.

## Shared context (binding for this milestone)
- `src/features/generation/lib/ai-client.ts` — the file being rewritten (internals only). Exports `generateFields(messages, config): Promise<ParsedFields>`; keep it.
- `src/features/generation/types.ts` — `ParsedFields`, `BadResponseError`, `TimeoutError`, `ProviderError`; **do not change** these.
- `src/features/generation/lib/prompt-builder.ts` — untouched; consumes `{ system, user }`.
- `src/features/generation/run-generation.ts` — `getAiConfig()` + `classifyError()` + `AiConfig` move out to `lib/ai-config.ts`; `runGeneration`/`generatePage` keep working with the moved import.
- `src/features/generation/lib/field-validation.ts` — calls `generateFields(..., aiConfig)` inside the retry closure; signature compatibility is mandatory.
- Approved deps: `langchain`, `@langchain/openai`, `@langchain/google-genai`.
- Decision #2 (EPIC.md): preserve structured output via `response_format`/`generationConfig` passthrough; **no `.withStructuredOutput()`**.
- Decision #5: `maxRetries: 0`.
- Debug rule: no `console.log` of keys/secrets.

## Verification (end of milestone)
- `langchain`, `@langchain/openai`, `@langchain/google-genai` in `package.json`.
- `tsc --noEmit` passes; `npm run lint` passes.
- `generateFields(messages, {...AiConfig})` signature unchanged; same return type.
- No raw `fetch` against AI providers remains in `ai-client.ts`.
- `run-generation.ts` no longer defines `getAiConfig`/`classifyError`; it imports them from `lib/ai-config.ts`.