import { NextResponse } from "next/server";
import { getUserDetail } from "@/features/admin/lib/roles";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { requireAdminApi } = await import("@/features/admin/lib/roles");
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { userId } = await params;
  const user = await getUserDetail(userId);
  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(user);
}
