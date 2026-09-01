import { NextResponse } from "next/server";
import { createSiteForCurrentUser } from "@/features/sites/api/create-site";

export async function POST(): Promise<NextResponse> {
  const result = await createSiteForCurrentUser();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json(result.site, { status: 201 });
}