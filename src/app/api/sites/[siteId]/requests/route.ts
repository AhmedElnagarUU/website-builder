import { NextResponse } from "next/server";
import { listRequestsForCurrentUser } from "@/features/requests/api/list-requests";
import { createRequestForCurrentUser } from "@/features/requests/api/create-request";
import type { RequestStatus } from "@/features/requests/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const url = new URL(request.url);
  const status = url.searchParams.get("status") as RequestStatus | null;
  const search = url.searchParams.get("search") ?? undefined;
  const filters: { status?: RequestStatus; search?: string } = {};
  if (status) filters.status = status;
  if (search) filters.search = search;

  const result = await listRequestsForCurrentUser(siteId, filters);
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
  const result = await createRequestForCurrentUser(siteId, body);
  if (result.ok) {
    return NextResponse.json(result, { status: 201 });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Validation error" }, { status: 422 });
}
