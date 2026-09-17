import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AiConfig } from "./ai-config";

export function createChatModel(config: AiConfig) {
  if (config.provider === "gemini") {
    return new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      model: config.model,
      temperature: 0.7,
      maxRetries: 0,
      json: config.useStructuredOutput !== false,
    });
  }

  const chat = new ChatOpenAI({
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
  });

  if (config.useStructuredOutput === false) return chat;
  return chat.withConfig({ response_format: { type: "json_object" } });
}
