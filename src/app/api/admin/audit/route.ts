import { NextResponse } from "next/server";
import { listAuditEntries } from "@/features/admin/api/audit";

export async function GET(request: Request): Promise<NextResponse> {
  const { requireAdminApi } = await import("@/features/admin/lib/roles");
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const targetUserId = url.searchParams.get("userId") ?? undefined;
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10)));

  const entries = await listAuditEntries(targetUserId, limit);
  return NextResponse.json({ entries });
}
