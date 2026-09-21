import { createHmac, timingSafeEqual } from "node:crypto";

// Polar webhooks — Standard Webhooks scheme (all Polar webhook secrets generated
// on or after 8 Sep 2026 are Standard-Webhooks secrets, the only live form now).
// The HMAC key is the full `whsec_…` string used DIRECTLY (never base64-decoded
// — that legacy decoding was Polar's old dual-key scheme). The message covered
// by the signature is `<webhook-id>.<webhook-timestamp>.<payload>` where
// `<payload>` is the EXACT raw bodies bytes Polar signed. The
// `webhook-signature` header carries one or more `v1,<base64>` values
// (space/comma separated, key-rotation safe). `webhook-timestamp` must fall
// inside the replay window to defeat replay attacks.
const REPLAY_WINDOW_MS = 5 * 60 * 1000;

function withinReplayWindow(timestamp: string): boolean {
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds)) return false;
  return Math.abs(Date.now() - seconds * 1000) <= REPLAY_WINDOW_MS;
}

function base64Equal(computed: Buffer, received: Buffer): boolean {
  return (
    computed.length === received.length && timingSafeEqual(computed, received)
  );
}

export function verifyPolarWebhookHmac(
  payload: string, // RAW body string (exact bytes Polar signed)
  receivedSignature: string, // `webhook-signature` header: `v1,<base64> v1,<base64>…`
  secret: string, // full `whsec_…` value, used DIRECTLY as the HMAC key
  timestamp?: string, // `webhook-timestamp` header
  webhookId?: string // `webhook-id` header
): boolean {
  if (!payload || !receivedSignature || !secret || !timestamp || !webhookId) {
    return false;
  }
  if (!withinReplayWindow(timestamp)) return false;

  const computed = createHmac("sha256", secret)
    .update(`${webhookId}.${timestamp}.${payload}`)
    .digest();
  const expectedB64 = Buffer.from(computed.toString("base64"), "utf8");

  // Accept if ANY `v1,<base64>` entry matches (survives key rotation). Entries
  // are space- and/or comma-separated.
  for (const entry of receivedSignature.split(/[\s,]+/)) {
    const match = /^v1,(.+)$/.exec(entry);
    if (!match) continue;
    const received = Buffer.from(match[1], "utf8");
    if (base64Equal(expectedB64, received)) return true;
  }
  return false;
}
