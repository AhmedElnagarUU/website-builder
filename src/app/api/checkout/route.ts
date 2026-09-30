import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { createCheckoutSession } from "@/features/payments/api/checkout";
import { checkoutSchema } from "@/features/payments/schema";
import { getAvailablePaymentMethods } from "@/features/payments/lib/payment-methods";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "phone_required" }, { status: 400 });
  }

  // Server resolves the allowed methods for THIS user's stored country and
  // refuses any method outside the set (422). The client only renders what
  // the same rule (lib/payment-methods.ts) provides.
  const available = getAvailablePaymentMethods(session.user.country);
  if (!available.includes(parsed.data.method)) {
    return NextResponse.json({ error: "method_unavailable" }, { status: 422 });
  }

  const result = await createCheckoutSession(
    {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    {
      planId: parsed.data.planId,
      phoneNumber: parsed.data.phoneNumber,
      method: parsed.data.method,
    }
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.code }, { status: result.status });
  }

  return NextResponse.json(
    {
      paymentId: result.paymentId,
      planId: result.planId,
      amountMinorUnits: result.amountMinorUnits,
      currency: result.currency,
      status: result.status,
      method: result.method ?? "polar",
      instructions: result.instructions,
      url: result.url,
    },
    { status: 200 }
  );
}