import { NextResponse } from "next/server";
import { getGenerationStatus } from "@/features/generation/api/get-status";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await getGenerationStatus(siteId);
  if (result.ok) {
    return NextResponse.json(result.data, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ error: result.error }, { status: 404 });
}