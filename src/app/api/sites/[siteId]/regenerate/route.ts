import { NextResponse } from "next/server";
import { regenerateSite } from "@/features/regeneration/api/regenerate-site";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<NextResponse> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const result = await regenerateSite(siteId, body);

  if (result.ok) {
    return NextResponse.json({ accepted: true }, { status: 202 });
  }
  if (result.error === "unauthorized") {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  if (result.error === "not_found") {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(
    { error: result.error, userEditedCount: result.userEditedCount },
    { status: 409 }
  );
}
