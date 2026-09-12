import { NextResponse } from "next/server";
import { getSiteForCurrentUser } from "@/features/sites/api/get-site";
import { deleteSiteForCurrentUser } from "@/features/sites/api/delete-site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await getSiteForCurrentUser(siteId);
  if (result.ok) {
    return NextResponse.json(result.site, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ error: result.error }, { status: 404 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const result = await deleteSiteForCurrentUser(siteId);
  if (result.ok) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ error: result.error }, { status: 404 });
}