# Task 01 — LangChain Model Factory + `ai-client.ts` Rewrite + Centralized Config

## Objective
Install LangChain, centralize AI config, and make `generateFields` call a LangChain chat model instead of raw HTTP — with zero behavior change for callers.

## Dependencies
None — first task of Epic 18.

## Scope

### Step 1 — Install dependencies
```bash
npm install langchain @langchain/openai @langchain/google-genai
```
Verify `npx tsc --noEmit` still passes before proceeding.

### Step 2 — `src/features/generation/lib/ai-config.ts` (new)
- Move the existing `AiConfig` interface, `getAiConfig()`, and `classifyError()` verbatim from `run-generation.ts` into this file (same env logic; do not rewrite the provider detection).
- Extend `AiConfig` with a discriminator: `provider: "gemini" | "openai-compat"`. `getAiConfig()` sets it based on the same condition it uses today (`geminiKey` present → `"gemini"`, else `"openai-compat"`).
- Keep `useStructuredOutput?: boolean` (currently always `true` from `getAiConfig`; preserved for compatibility with `field-validation.ts`).
- Re-export the same names so imports in `run-generation.ts` can be switched cleanly.

### Step 3 — `src/features/generation/lib/model-factory.ts` (new)
Export a single `createChatModel(config: AiConfig)` returning a BaseChatModel:
```ts
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AiConfig } from "./ai-config";

export function createChatModel(config: AiConfig) {
  if (config.provider === "gemini") {
    return new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: config.model,
      temperature: 0.7,
      maxRetries: 0,
      generationConfig: config.useStructuredOutput !== false ? { responseMimeType: "application/json" } : undefined,
    });
  }
  return new ChatOpenAI({
    apiKey: config.apiKey,
    modelName: config.model,
    temperature: 0.7,
    maxRetries: 0,
    timeout: 180_000,
    configuration: {
      baseURL: config.baseUrl,
      defaultHeaders: config.extraHeaders,
      fetch: config.fetchImpl ?? undefined,
    },
  }).bind({ response_format: { type: "json_object" } });
}
```
Rules:
- Gemini `model` comes from `getAiConfig()` (`gemini-3.6-flash`); `apiKey` = `GEMINI_KEY`.
- OpenAI-compatible `modelName`, `baseURL`, `defaultHeaders`, `fetch` (the injection seam) map 1:1 from priority order in `getAiConfig()`.
- Do NOT pass `useStructuredOutput: false` to the OpenAI `.bind` — if `useStructuredOutput === false`, return the model without `.bind` (mirror current behavior where `response_format` is omitted).

### Step 4 — Rewrite `src/features/generation/lib/ai-client.ts`
- Delete the raw HTTP machinery: `ChatRequest`, `ChatResponse`, `GeminiRequest`, `GeminiResponse`, `isGemini()`, and the whole `fetch` block.
- Keep the parsing helpers `stripFences`, `isStringMap`, `requireJson`, and the exported `generateFields`.
- New `generateFields`:
```ts
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { createChatModel } from "./model-factory";
import { BadResponseError, ProviderError, TimeoutError } from "../types";
import type { ParsedFields } from "../types";
import type { AiConfig } from "./ai-config";

export async function generateFields(messages: { system: string; user: string }, config: AiConfig): Promise<ParsedFields> {
  const model = createChatModel(config);
  const chatMessages = [new SystemMessage(messages.system), new HumanMessage(messages.user)];
  let response;
  try {
    response = await model.invoke(chatMessages);
  } catch (e) {
    const name = (e as Error)?.name ?? "";
    if (/timeout|abort/i.test(name)) {
      throw new TimeoutError("AI provider timed out after 180000ms");
    }
    throw new ProviderError(`AI provider request failed: ${(e as Error).message}`);
  }
  const content = typeof response.content === "string" ? response.content : "";
  if (content.length === 0) {
    throw new BadResponseError("AI response missing message content");
  }
  return requireJson(content);
}
```
- Timeout: the OpenAI branch's `timeout: 180_000` covers the current 180s contract for that provider. For Gemini, if `ChatGoogleGenerativeAI` does not expose a timeout in its options, note it in the report (behavioral parity: the previous code applied the timeout to BOTH providers via AbortController).
- Keep `fetchImpl` semantics: OpenAI branch honors it via `configuration.fetch`; if omitted, defaults to global fetch — matching the old default. Gemini branch: if `fetchImpl` is passed yet not supported by `@langchain/google-genai`, document the limitation in the report (do not silently ignore).

### Step 5 — `src/features/generation/run-generation.ts`
- Remove the local definitions of `getAiConfig`, `classifyError`, and the `AiConfig` interface.
- Import them from `./lib/ai-config`.
- No other changes to `runGeneration`/`generatePage`.
- Verify the retry closure in `field-validation.ts` call sites still compile (they pass `aiConfig` through unchanged).

## New files created
- `src/features/generation/lib/ai-config.ts`
- `src/features/generation/lib/model-factory.ts`

## Files modified
- `package.json` (+ 3 langchain packages)
- `src/features/generation/lib/ai-client.ts` (rewrite internals)
- `src/features/generation/run-generation.ts` (imports only)

## Acceptance criteria
- `generateFields(messages, config): Promise<ParsedFields>` signature unchanged and `field-validation.ts` still compiles.
- Prompts (`system`/`user`) passed verbatim to LangChain messages; `prompt-builder.ts` untouched.
- Structured output via `response_format` (OpenAI-compat) and `responseMimeType` (Gemini); no `.withStructuredOutput()`.
- `BadResponseError`/`TimeoutError`/`ProviderError` preserved; `classifyError()` behavior unchanged.
- No raw provider `fetch`/URL construction in `ai-client.ts`.
- `tsc --noEmit` passes; `npm run lint` passes.