import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { getTemplate } from "@/features/templates/api/list-templates";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ templateId: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(template, { status: 200 });
}