import { NextResponse } from "next/server";
import { switchSiteTemplate } from "@/features/sites/api/switch-site-template";
import { getTemplate } from "@/features/templates/api/list-templates";
import { withEntitlement } from "@/features/monetization/lib/entitlement";

function targetPageCount(rawBody: unknown): number | null {
  if (!rawBody || typeof rawBody !== "object") return null;
  const templateId = (rawBody as { templateId?: unknown }).templateId;
  if (typeof templateId !== "string") return null;
  const template = getTemplate(templateId);
  return template ? template.pages.length : null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Response> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const pages = targetPageCount(body);
  const scope =
    pages === null
      ? undefined
      : { siteId, amount: pages };

  return withEntitlement(
    { siteId, limitKey: "maxPagesPerSite", requestedScope: scope },
    async () => {
      const result = await switchSiteTemplate(siteId, body);

      if (result.ok) {
        return NextResponse.json({ accepted: true }, { status: 202 });
      }
      if (result.error === "unauthorized") {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      if (result.error === "not_found") {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
      if (result.error === "invalid_template") {
        return NextResponse.json({ error: result.error }, { status: 422 });
      }
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
  );
}