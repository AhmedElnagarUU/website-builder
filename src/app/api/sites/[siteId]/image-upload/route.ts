import { NextResponse } from "next/server";
import { requestImageUpload } from "@/features/images/api/request-image-upload";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await requestImageUpload(siteId, body);

  if (result.ok) {
    return NextResponse.json({ uploadUrl: result.uploadUrl, s3Key: result.s3Key }, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ error: result.error }, { status: 422 });
}
