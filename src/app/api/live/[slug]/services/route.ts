import { NextResponse } from "next/server";
import { listPublicServices } from "@/features/services/api/list-public-services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  const result = await listPublicServices(slug);
  if (result.ok) {
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
