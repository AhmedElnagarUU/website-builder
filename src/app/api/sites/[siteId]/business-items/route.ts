import { NextResponse } from "next/server";
import { listBusinessItemsForCurrentUser } from "@/features/business-content/api/list-business-items";
import { createBusinessItemForCurrentUser } from "@/features/business-content/api/create-business-item";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const searchParams = new URL(request.url).searchParams;
  const result = await listBusinessItemsForCurrentUser(siteId, {
    kind: searchParams.get("kind") ?? undefined,
    locale: searchParams.get("locale") ?? undefined,
    includeInactive: searchParams.get("includeInactive") ?? undefined,
  });
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (result.error === "validation_error")
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await createBusinessItemForCurrentUser(siteId, body);
  if (result.ok) {
    return NextResponse.json(result, { status: 201 });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (result.error === "conflict")
    return NextResponse.json({ error: "conflict" }, { status: 409 });
  return NextResponse.json({ error: "validation_error" }, { status: 422 });
}
