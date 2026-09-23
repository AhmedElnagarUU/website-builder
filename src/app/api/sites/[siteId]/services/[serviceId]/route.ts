import { NextResponse } from "next/server";
import { getServiceForCurrentUser } from "@/features/services/api/get-service";
import { updateServiceForCurrentUser } from "@/features/services/api/update-service";
import { deleteServiceForCurrentUser } from "@/features/services/api/delete-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; serviceId: string }> }
): Promise<NextResponse> {
  const { siteId, serviceId } = await params;
  const result = await getServiceForCurrentUser(siteId, serviceId);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string; serviceId: string }> }
): Promise<NextResponse> {
  const { siteId, serviceId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await updateServiceForCurrentUser(siteId, serviceId, body);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Validation error" }, { status: 422 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; serviceId: string }> }
): Promise<NextResponse> {
  const { siteId, serviceId } = await params;
  const result = await deleteServiceForCurrentUser(siteId, serviceId);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Conflict" }, { status: 409 });
}
