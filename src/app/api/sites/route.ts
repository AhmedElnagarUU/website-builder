import { NextResponse } from "next/server";
import { createSiteForCurrentUser } from "@/features/sites/api/create-site";
import { withEntitlement } from "@/features/monetization/lib/entitlement";

export async function POST(): Promise<Response> {
  return withEntitlement({ limitKey: "maxSites" }, async () => {
    const result = await createSiteForCurrentUser();
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json(result.site, { status: 201 });
  });
}