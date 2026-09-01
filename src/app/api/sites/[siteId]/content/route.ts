import { NextResponse } from "next/server";
import { updateContent } from "@/features/sites/api/update-content";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await updateContent(siteId, body);

  if (result.ok) {
    return NextResponse.json(result.site, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ error: result.error, field: result.field }, { status: 422 });
}
