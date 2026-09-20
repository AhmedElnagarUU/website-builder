import { createHmac, timingSafeEqual } from "node:crypto";

// Polar webhooks follow the Standard Webhooks spec (Polar secrets generated on
// or after 8 Sep 2026, 00:00 UTC — which is now, so this is the live form).
// The message covered by the signature is:
//
//   `<webhook-id>.<webhook-timestamp>.<payload>`
//
// where `<webhook-id>` is the `webhook-id` header and `<payload>` is the EXACT
// raw request body bytes Polar signed (never a re-serialised object). The
// `webhook-signature` header carries one or more `v1,<base64signature>` values
// separated by spaces; the HMAC secret is the base64-decoded bytes of the full
// `whsec_…` value. `webhook-timestamp` must fall inside the replay window to
// prevent replay attacks.
const REPLAY_WINDOW_MS = 5 * 60 * 1000;

function withinReplayWindow(timestamp: string): boolean {
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds)) return false;
  return Math.abs(Date.now() - seconds * 1000) <= REPLAY_WINDOW_MS;
}

function fromBase64(value: string): Buffer {
  return Buffer.from(value, "base64");
}

function timingSafeMatch(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyPolarWebhookHmac(
  payload: string, // RAW body string (exact bytes Polar signed)
  receivedSignature: string, // `webhook-signature` header: `v1,<base64> v1,<base64> …`
  secret: string, // full `whsec_…` value; base64-decoded for the HMAC key
  timestamp?: string, // `webhook-timestamp` header
  webhookId?: string // `webhook-id` header
): boolean {
  if (!payload || !receivedSignature || !secret || !timestamp || !webhookId) {
    return false;
  }
  if (!withinReplayWindow(timestamp)) return false;

  const computed = createHmac("sha256", fromBase64(secret))
    .update(`${webhookId}.${timestamp}.${payload}`)
    .digest();
  const expected = Buffer.from(computed.toString("base64"), "utf8");

  // Accept if ANY `v1,<base64>` entry matches (supports key rotation). Entries
  // are space- and/or comma-separated; each `v1,` value is the base64 digest.
  const entries = receivedSignature.trim().split(/[\s,]+/);
  for (const entry of entries) {
    const match = /^v1,(.+)$/.exec(entry);
    if (!match) continue;
    const received = Buffer.from(match[1], "utf8");
    if (!timingSafeMatch(expected, received)) continue;
    return true;
  }
  return false;
}
