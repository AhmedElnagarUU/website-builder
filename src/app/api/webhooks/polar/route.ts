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
  // unset, so WITH missing credentials this handler answers 200
  // { error: "provider_error" } instead of breaking the build/boot; the app
  // still builds and runs until the operator provisions secrets.
  let provider: PaymentProvider;
  let PolarProviderErrorClass: typeof PolarProviderError;
  try {
    const mod = await import("@/features/payments/polar");
    PolarProviderErrorClass = mod.PolarProviderError;
    provider = new mod.PolarProvider();
  } catch {
    console.error("polar webhook: provider unavailable (disabled)");
    return NextResponse.json({ error: "provider_error" }, { status: 200 });
  }

  let result: PaymentWebhookResult;
  try {
    result = await provider.handleWebhook(rawBody, hmac, timestamp, webhookId ?? undefined);
  } catch (err) {
    if (err instanceof PolarProviderErrorClass) {
      console.error("polar webhook: invalid hmac (tx id hidden)");
      return NextResponse.json({ error: "invalid_hmac" }, { status: 401 });
    }
    console.error("polar webhook: handler failed (ignored)");
    return NextResponse.json({ error: "provider_error" }, { status: 200 });
  }

  try {
    const { processPaymobWebhook } = await import("@/features/payments/api/webhook");
    const handed = await processPaymobWebhook(result);
    return NextResponse.json(
      { received: true, outcome: handed.outcome },
      { status: 200 }
    );
  } catch {
    console.error("polar webhook: processing failed (ignored)");
    return NextResponse.json({ error: "provider_error" }, { status: 200 });
  }
}