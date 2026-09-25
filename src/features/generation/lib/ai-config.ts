export interface AiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  extraHeaders?: Record<string, string>;
  useStructuredOutput?: boolean;
  fetchImpl?: typeof fetch;
  provider: "gemini" | "openai-compat";
}

export function getAiConfig(): AiConfig {
  // Prefer OpenRouter when explicitly configured — avoids conflicts with
  // GEMINI_KEY and lets users control the model via AI_MODEL.
  const baseUrl = process.env.AI_API_BASE_URL;
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (baseUrl && apiKey && model) {
    const extraHeaders: Record<string, string> = {};
    const referer = process.env.NEXT_PUBLIC_APP_URL;
    if (referer) extraHeaders["HTTP-Referer"] = referer;
    const appName = process.env.AI_APP_NAME || "Monomastic";
    extraHeaders["X-Title"] = appName;
    return { baseUrl, apiKey, model, extraHeaders, useStructuredOutput: true, provider: "openai-compat" };
  }

  const geminiKey = process.env.GEMINI_KEY;
  if (geminiKey) {
    const geminiModel = "gemini-2.0-flash";
    const geminiBaseUrl = process.env.AI_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
    return { baseUrl: geminiBaseUrl, apiKey: geminiKey, model: geminiModel, useStructuredOutput: true, provider: "gemini" };
  }

  if (!baseUrl) throw new Error("AI_API_BASE_URL is not defined");
  if (!apiKey) throw new Error("AI_API_KEY (or OPENROUTER_API_KEY) is not defined");
  if (!model) throw new Error("AI_MODEL is not defined");

  const extraHeaders: Record<string, string> = {};
  const referer = process.env.NEXT_PUBLIC_APP_URL;
  if (referer) extraHeaders["HTTP-Referer"] = referer;
  const appName = process.env.AI_APP_NAME || "Monomastic";
  extraHeaders["X-Title"] = appName;

  return { baseUrl, apiKey, model, extraHeaders, useStructuredOutput: true, provider: "openai-compat" };
}

export function classifyError(e: unknown): "timeout" | "provider_error" | "bad_response" {
  const name = (e as Error)?.name;
  if (name === "TimeoutError") return "timeout";
  if (name === "BadResponseError") return "bad_response";
  return "provider_error";
}
