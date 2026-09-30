import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { verifyManualPayment } from "@/features/payments/api/manual-payment";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { paymentId } = await params;
  const result = await verifyManualPayment(paymentId, session.user.email);
  if (!result.ok) {
    if (result.code === "not_admin") {
      return NextResponse.json({ error: result.code }, { status: 403 });
    }
    if (result.code === "invalid_state") {
      return NextResponse.json({ error: result.code }, { status: 409 });
    }
    return NextResponse.json({ error: result.code }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}