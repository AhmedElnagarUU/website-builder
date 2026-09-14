import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner, updateSite, toSiteDTO } from "@/features/sites/repository";
import { businessInfoPatchSchema } from "@/features/sites/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Response> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const parsed = businessInfoPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  }

  // Only settings page fields: name and category
  const { name, category } = parsed.data;

  const updatedBusinessInfo = { ...site.businessInfo };
  if (name !== undefined) updatedBusinessInfo.name = name;
  if (category !== undefined) updatedBusinessInfo.category = category;

  const hasUnpublishedChanges =
    site.publishedSnapshot !== null ? true : site.hasUnpublishedChanges;

  const updated = await updateSite(siteId, {
    businessInfo: updatedBusinessInfo,
    hasUnpublishedChanges,
  });

  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json(toSiteDTO(updated), { status: 200 });
}
