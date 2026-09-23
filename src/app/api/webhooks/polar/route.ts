import { NextResponse, type NextRequest } from "next/server";
import type { PolarProviderError } from "@/features/payments/polar";
import type { PaymentProvider } from "@/features/payments/provider";
import type { PaymentWebhookResult } from "@/features/payments/types";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: true, message: "Polar webhook endpoint is ready" },
    { status: 200 }
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const hmac = request.headers.get("webhook-signature");
  const timestamp = request.headers.get("webhook-timestamp");
  const webhookId = request.headers.get("webhook-id");

  // Standard Webhooks sign the exact body bytes, so read raw text before any
  // JSON parsing; the hmac module covers the `<timestamp>.<payload>` message.
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!rawBody || !hmac || !timestamp) {
    return NextResponse.json({ error: "invalid_hmac" }, { status: 400 });
  }

  // Lazy import: polar/config.ts getters throw while the POLAR_* secrets are
  // unset, so WITH missing credentials this handler answers 503
  // (not 2xx) — the app still builds and boots; the endpoint operator
  // will notice immediately and provision the secrets.
  let provider: PaymentProvider;
  let PolarProviderErrorClass: typeof PolarProviderError;
  try {
    const mod = await import("@/features/payments/polar");
    PolarProviderErrorClass = mod.PolarProviderError;
    provider = new mod.PolarProvider();
  } catch {
    console.error("polar webhook: provider unavailable (disabled)");
    return NextResponse.json({ error: "provider_error" }, { status: 503 });
  }

  let result: PaymentWebhookResult;
  try {
    result = await provider.handleWebhook(rawBody, hmac, timestamp, webhookId ?? undefined);
  } catch (err) {
    if (err instanceof PolarProviderErrorClass) {
      console.error("polar webhook: invalid hmac (tx id hidden)");
      return NextResponse.json({ error: "invalid_hmac" }, { status: 403 });
    }
    console.error("polar webhook: handler failed");
    return NextResponse.json({ error: "provider_error" }, { status: 500 });
  }

  try {
    const { processPaymobWebhook } = await import("@/features/payments/api/webhook");
    const handed = await processPaymobWebhook(result);
    return NextResponse.json(
      { received: true, outcome: handed.outcome },
      { status: 202 }
    );
  } catch {
    console.error("polar webhook: processing failed");
    return NextResponse.json({ error: "provider_error" }, { status: 500 });
  }
}