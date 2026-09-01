import { NextResponse } from "next/server";
import { getRegenerateImpact } from "@/features/regeneration/api/regenerate-impact";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await getRegenerateImpact(siteId);

  if (result.ok) {
    return NextResponse.json(result.data, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ error: result.error }, { status: 404 });
}
