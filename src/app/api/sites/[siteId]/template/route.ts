import { NextResponse } from "next/server";
import { updateSiteTemplate } from "@/features/templates/api/update-site-template";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: { templateId?: unknown } = await request.json().catch(() => ({}));
  if (typeof body.templateId !== "string") {
    return NextResponse.json({ error: "invalid_template" }, { status: 422 });
  }
  const result = await updateSiteTemplate(siteId, body.templateId);
  if (result.ok) {
    return NextResponse.json(result.site, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ error: result.error }, { status: 422 });
}