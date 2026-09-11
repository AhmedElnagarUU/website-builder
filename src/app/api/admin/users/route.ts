import { NextResponse } from "next/server";
import { listAllUsers } from "@/features/admin/lib/roles";

export async function GET(request: Request): Promise<NextResponse> {
  const { requireAdminApi } = await import("@/features/admin/lib/roles");
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  const sort = (url.searchParams.get("sort") as "createdAt" | "updatedAt") ?? "createdAt";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)));

  const result = await listAllUsers(q, sort, page, limit);
  return NextResponse.json(result);
}
