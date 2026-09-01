import { NextResponse } from "next/server";
import { publishSite } from "@/features/publishing/publish-site";
import { nextUrl } from "@/features/publishing/live-url";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await publishSite(siteId);

  if (result.ok) {
    const host = request.headers.get("host") ?? undefined;
    return NextResponse.json(
      { site: result.site, slug: result.slug, liveUrl: nextUrl(result.slug, host) },
      { status: 200 }
    );
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ error: "validation_error" }, { status: 422 });
}
