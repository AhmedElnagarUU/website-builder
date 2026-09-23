import { NextResponse } from "next/server";
import { listCustomersForCurrentUser } from "@/features/customers/api/list-customers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const search = new URL(request.url).searchParams.get("search") ?? undefined;
  const result = await listCustomersForCurrentUser(siteId, search);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
