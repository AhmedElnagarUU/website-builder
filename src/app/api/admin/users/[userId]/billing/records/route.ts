import { NextResponse } from "next/server";
import { adminRecordPaymentForUser } from "@/features/monetization/api/admin-record-payment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { userId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await adminRecordPaymentForUser(userId, body);

  if (result.ok) {
    return NextResponse.json(result.record, { status: 201 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (result.error === "forbidden") {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ error: result.error }, { status: 422 });
}