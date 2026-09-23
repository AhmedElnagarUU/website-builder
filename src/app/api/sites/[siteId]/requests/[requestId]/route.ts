import { NextResponse } from "next/server";
import { getRequestForCurrentUser } from "@/features/requests/api/get-request";
import { updateRequestStatusForCurrentUser } from "@/features/requests/api/update-request-status";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; requestId: string }> }
): Promise<NextResponse> {
  const { siteId, requestId } = await params;
  const result = await getRequestForCurrentUser(siteId, requestId);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string; requestId: string }> }
): Promise<NextResponse> {
  const { siteId, requestId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await updateRequestStatusForCurrentUser(siteId, requestId, body);
  if (result.ok) {
    return NextResponse.json({ success: true });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Validation error" }, { status: 422 });
}
