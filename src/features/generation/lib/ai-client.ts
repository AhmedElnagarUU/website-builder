import { BadResponseError, ProviderError, TimeoutError } from "../types";
import type { ParsedFields } from "../types";

const TIMEOUT_MS = 180_000;

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  response_format?: { type: "json_object" };
}

interface ChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface GeminiRequest {
  system_instruction?: { parts: Array<{ text: string }> };
  contents: Array<{ role: string; parts: Array<{ text: string }> }>;
  generationConfig: {
    temperature: number;
    responseMimeType?: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

function isGemini(baseUrl: string): boolean {
  return baseUrl.includes("generativelanguage.googleapis.com");
}

function stripFences(s: string): string {
  const trimmed = s.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}

function isStringMap(v: unknown): v is ParsedFields {
  if (typeof v !== "object" || v === null) return false;
  if (Array.isArray(v)) return false;
  for (const k of Object.keys(v)) {
    if (typeof (v as Record<string, unknown>)[k] !== "string") return false;
  }
  return true;
}

function requireJson(text: string): ParsedFields {
  const cleaned = stripFences(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new BadResponseError("AI response content was not valid JSON");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new BadResponseError("AI response top-level is not an object");
  }

  const fields = (parsed as { fields?: unknown }).fields;
  if (!isStringMap(fields)) {
    throw new BadResponseError("AI response 'fields' is not a string map");
  }

  return fields;
}

export async function generateFields(
  messages: { system: string; user: string },
  config: {
    baseUrl: string;
    apiKey: string;
    model: string;
    extraHeaders?: Record<string, string>;
    useStructuredOutput?: boolean;
    fetchImpl?: typeof fetch;
  }
): Promise<ParsedFields> {
  const fetchImpl = config.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = Date.now();

  let url: string;
  let headers: Record<string, string>;
  let body: unknown;

  if (isGemini(config.baseUrl)) {
    const base = config.baseUrl.replace(/\/$/, "");
    url = `${base}/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(
      config.apiKey
    )}`;
    const req: GeminiRequest = {
      contents: [{ role: "user", parts: [{ text: messages.user }] }],
      generationConfig: { temperature: 0.7 },
    };
    if (messages.system) {
      req.system_instruction = { parts: [{ text: messages.system }] };
    }
    if (config.useStructuredOutput !== false) {
      req.generationConfig.responseMimeType = "application/json";
    }
    headers = { "Content-Type": "application/json" };
    body = req;
  } else {
    const req: ChatRequest = {
      model: config.model,
      messages: [
        { role: "system", content: messages.system },
        { role: "user", content: messages.user },
      ],
      temperature: 0.7,
    };
    if (config.useStructuredOutput !== false) {
      req.response_format = { type: "json_object" };
    }
    url = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      ...(config.extraHeaders ?? {}),
    };
    body = req;
  }

  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (controller.signal.aborted) {
      throw new TimeoutError(`AI provider timed out after ${TIMEOUT_MS}ms`);
    }
    throw new ProviderError(`AI provider request failed: ${(e as Error).message}`);
  }
  clearTimeout(timer);

  if (!res.ok) {
    const duration = Date.now() - start;
    const detail = await res.text().catch(() => "");
    console.error(`AI provider returned status ${res.status} in ${duration}ms: ${detail}`);
    throw new ProviderError(`AI provider returned status ${res.status}`);
  }

  if (isGemini(config.baseUrl)) {
    let data: GeminiResponse;
    try {
      data = (await res.json()) as GeminiResponse;
    } catch {
      throw new BadResponseError("AI response was not valid JSON");
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || text.length === 0) {
      throw new BadResponseError("AI response missing message content");
    }
    return requireJson(text);
  }

  let data: ChatResponse;
  try {
    data = (await res.json()) as ChatResponse;
  } catch {
    throw new BadResponseError("AI response was not valid JSON");
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.length === 0) {
    throw new BadResponseError("AI response missing message content");
  }

  return requireJson(content);
}