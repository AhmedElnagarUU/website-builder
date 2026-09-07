import { NextResponse } from "next/server";
import { getSiteAnalytics } from "@/features/analytics/api/get-site-analytics";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await getSiteAnalytics(siteId);
  if (result.ok) {
    return NextResponse.json(result.data, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ error: result.error }, { status: 404 });
}
