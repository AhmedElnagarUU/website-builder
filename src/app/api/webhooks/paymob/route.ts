import { NextResponse, type NextRequest } from "next/server";
import type { PaymobProviderError } from "@/features/payments/paymob";
import type { PaymentProvider } from "@/features/payments/provider";
import type { PaymentWebhookResult } from "@/features/payments/types";

interface WebhookPayload {
  type?: unknown;
  obj?: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const hmac = request.nextUrl.searchParams.get("hmac");

  let body: WebhookPayload;
  try {
    const parsed: unknown = await request.json();
    body = typeof parsed === "object" && parsed !== null ? (parsed as WebhookPayload) : {};
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!body.obj || !hmac) {
    return NextResponse.json({ error: "invalid_hmac" }, { status: 400 });
  }

  // Lazy import: paymob/config.ts throws on import while the PAYMOB_* secrets
  // are unset, so WITH missing credentials this handler answers 200
  // { error: "provider_error" } instead of breaking the build/boot; the app
  // still builds and runs until the operator provisions secrets.
  let provider: PaymentProvider;
  let PaymobProviderErrorClass: typeof PaymobProviderError;
  try {
    const mod = await import("@/features/payments/paymob");
    PaymobProviderErrorClass = mod.PaymobProviderError;
    provider = new mod.PaymobProvider();
  } catch {
    console.error("paymob webhook: provider unavailable (disabled)");
    return NextResponse.json({ error: "provider_error" }, { status: 200 });
  }

  let result: PaymentWebhookResult;
  try {
    result = await provider.handleWebhook(body, hmac);
  } catch (err) {
    if (err instanceof PaymobProviderErrorClass) {
      console.error("paymob webhook: invalid hmac (tx id hidden)");
      return NextResponse.json({ error: "invalid_hmac" }, { status: 401 });
    }
    console.error("paymob webhook: handler failed (ignored)");
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
    console.error("paymob webhook: processing failed (ignored)");
    return NextResponse.json({ error: "provider_error" }, { status: 200 });
  }
}