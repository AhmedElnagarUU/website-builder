import { NextResponse } from "next/server";
import { reorderServicesForCurrentUser } from "@/features/services/api/reorder-services";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await reorderServicesForCurrentUser(siteId, body);
  if (result.ok) {
    return NextResponse.json({ success: true });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Validation error" }, { status: 422 });
}
