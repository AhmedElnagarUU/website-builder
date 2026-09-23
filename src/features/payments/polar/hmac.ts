import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

export { WebhookVerificationError };

export interface PolarVerifiedEvent {
  type: string;
  data: Record<string, unknown>;
}

/**
 * Verifies a Polar webhook signature AND parses the payload using the official
 * @polar-sh/sdk Standard Webhooks validation. Replaces the hand-rolled HMAC
 * verification that previously lived here.
 *
 * - Invalid signature → throws WebhookVerificationError
 * - Valid signature + known event type → returns { type, data }
 * - Valid signature + unknown event type → the SDK's parseEvent throws
 *   SDKValidationError; we fall back to basic JSON parsing so the caller can
 *   still extract the event type and treat it as "pending" (no money movement).
 */
export function verifyAndParsePolarWebhook(
  rawBody: string,
  headers: Record<string, string>,
  secret: string
): PolarVerifiedEvent {
  try {
    const event = validateEvent(rawBody, headers, secret);
    return {
      type: typeof (event as { type?: unknown }).type === "string"
        ? (event as { type: string }).type
        : "",
      data:
        (event as { data?: Record<string, unknown> }).data ?? {},
    };
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      throw err;
    }
    // Signature was valid (the standardwebhooks library verified it before
    // parseEvent was called), but the event type is unknown. Fall back to
    // manual JSON parsing — same behavior as before the SDK migration.
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new WebhookVerificationError("invalid payload");
    }
    const payload =
      parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};
    return {
      type: typeof payload.type === "string" ? payload.type : "",
      data:
        payload.data && typeof payload.data === "object"
          ? (payload.data as Record<string, unknown>)
          : {},
    };
  }
}
