import { NextResponse } from "next/server";
import { getCustomerForCurrentUser } from "@/features/customers/api/get-customer";
import { updateCustomerForCurrentUser } from "@/features/customers/api/update-customer";
import { deleteCustomerForCurrentUser } from "@/features/customers/api/delete-customer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string; customerId: string }> }
): Promise<NextResponse> {
  const { siteId, customerId } = await params;
  const result = await getCustomerForCurrentUser(siteId, customerId);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string; customerId: string }> }
): Promise<NextResponse> {
  const { siteId, customerId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await updateCustomerForCurrentUser(siteId, customerId, body);
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
  { params }: { params: Promise<{ siteId: string; customerId: string }> }
): Promise<NextResponse> {
  const { siteId, customerId } = await params;
  const result = await deleteCustomerForCurrentUser(siteId, customerId);
  if (result.ok) {
    return NextResponse.json({ success: true });
  }
  if (result.error === "unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (result.error === "not_found")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Conflict" }, { status: 409 });
}
