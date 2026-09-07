import { NextResponse } from "next/server";
import { adminSetSubscriptionForUser } from "@/features/monetization/api/admin-set-subscription";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { userId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await adminSetSubscriptionForUser(userId, body);

  if (result.ok) {
    return NextResponse.json(result.subscription, { status: 200 });
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