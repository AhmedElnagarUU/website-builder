import { NextResponse } from "next/server";
import { updateBusinessInfo } from "@/features/sites/api/update-business-info";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await updateBusinessInfo(siteId, body);
  if (result.ok) {
    return NextResponse.json(result.site, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  if (result.error === "validation_error") {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }
  return NextResponse.json({ error: result.error }, { status: 422 });
}