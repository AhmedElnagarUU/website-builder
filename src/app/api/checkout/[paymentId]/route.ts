import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { getCheckoutStatus } from "@/features/payments/api/checkout";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { paymentId } = await params;
  const status = await getCheckoutStatus(paymentId, session.user.id);
  if (!status) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(status, { status: 200 });
}