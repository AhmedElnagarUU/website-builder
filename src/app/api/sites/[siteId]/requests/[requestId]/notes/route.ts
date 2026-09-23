import { NextResponse } from "next/server";
import { addRequestNoteForCurrentUser } from "@/features/requests/api/add-request-note";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string; requestId: string }> }
): Promise<NextResponse> {
  const { siteId, requestId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await addRequestNoteForCurrentUser(siteId, requestId, body);
  if (result.ok) {
    return NextResponse.json({ success: true });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Validation error" }, { status: 422 });
}
