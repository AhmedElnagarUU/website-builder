import { NextResponse } from "next/server";
import { getBusinessItemForCurrentUser } from "@/features/business-content/api/get-business-item";
import { updateBusinessItemForCurrentUser } from "@/features/business-content/api/update-business-item";
import { deleteBusinessItemForCurrentUser } from "@/features/business-content/api/delete-business-item";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; itemId: string }> }
): Promise<NextResponse> {
  const { siteId, itemId } = await params;
  const result = await getBusinessItemForCurrentUser(siteId, itemId);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string; itemId: string }> }
): Promise<NextResponse> {
  const { siteId, itemId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await updateBusinessItemForCurrentUser(siteId, itemId, body);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ error: "validation_error" }, { status: 422 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; itemId: string }> }
): Promise<NextResponse> {
  const { siteId, itemId } = await params;
  const result = await deleteBusinessItemForCurrentUser(siteId, itemId);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}
