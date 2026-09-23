import { NextResponse } from "next/server";
import { listServicesForCurrentUser } from "@/features/services/api/list-services";
import { createServiceForCurrentUser } from "@/features/services/api/create-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const showInactive = new URL(_request.url).searchParams.get("includeInactive") === "true";
  const result = await listServicesForCurrentUser(siteId, showInactive);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await createServiceForCurrentUser(siteId, body);
  if (result.ok) {
    return NextResponse.json(result, { status: 201 });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Validation error" }, { status: 422 });
}
