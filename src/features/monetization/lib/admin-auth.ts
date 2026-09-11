import { NextResponse } from "next/server";
import { requireAdminApi } from "@/features/admin/lib/roles";

export async function requireAdmin(): Promise<
  | { ok: true; adminUserId: string }
  | { ok: false; response: NextResponse }
> {
  const result = await requireAdminApi();
  if (result.ok) {
    return { ok: true, adminUserId: result.adminUserId };
  }
  return {
    ok: false,
    response: NextResponse.json({ error: result.error }, { status: result.status }),
  };
}