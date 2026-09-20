import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { createCheckoutSession } from "@/features/payments/api/checkout";
import { checkoutSchema } from "@/features/payments/schema";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const result = await createCheckoutSession(session.user, parsed.data);
  
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
      clientSecret: result.clientSecret,
      publicKey: result.publicKey,
      paymentMethods: result.paymentMethods,
      ...(result.url ? { url: result.url } : {}),
    },
    { status: 201 }
  );
}