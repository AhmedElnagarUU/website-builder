import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { submitManualProof } from "@/features/payments/api/manual-payment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { paymentId } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await submitManualProof(paymentId, session.user.id, body);
  if (!result.ok) {
    if (result.code === "validation_error") {
      return NextResponse.json({ error: result.code }, { status: 422 });
    }
    if (result.code === "expired") {
      return NextResponse.json({ error: result.code }, { status: 409 });
    }
    return NextResponse.json({ error: result.code }, { status: result.code === "invalid_state" ? 409 : 404 });
  }

  return NextResponse.json(result, { status: 200 });
}