import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { listTemplates, rankTemplatesByCategory } from "@/features/templates/api/list-templates";

export async function GET(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const suggested = searchParams.get("suggested");
  const category = searchParams.get("category");

  if (suggested === "true") {
    const result = rankTemplatesByCategory(category);
    return NextResponse.json(result.data, { status: 200 });
  }

  const result = listTemplates();
  return NextResponse.json(result.data, { status: 200 });
}