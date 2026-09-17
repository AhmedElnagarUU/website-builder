import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { createChatModel } from "./model-factory";
import { BadResponseError, ProviderError, TimeoutError } from "../types";
import type { ParsedFields } from "../types";
import type { AiConfig } from "./ai-config";

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
  config: AiConfig
): Promise<ParsedFields> {
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
