import { NextResponse } from "next/server";
import { setUserStatus } from "@/features/admin/api/set-user-status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { userId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await setUserStatus(userId, body);

  if (result.ok) {
    return NextResponse.json({ status: result.status });
  }
  return NextResponse.json({ error: result.error }, { status: result.status });
}
