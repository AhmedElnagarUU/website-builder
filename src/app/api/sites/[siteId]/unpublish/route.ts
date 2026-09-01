import { NextResponse } from "next/server";
import { unpublishSite } from "@/features/publishing/unpublish-site";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await unpublishSite(siteId);

  if (result.ok) {
    return NextResponse.json({ site: result.site }, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}