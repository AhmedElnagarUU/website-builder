import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { getAdminRole } from "../repository";

// TODO(epic-12): when Epic 12 M01 lands (@/features/admin/lib/roles.ts and
// session.user.role), re-point this guard at it so admin identity lives in one place.
export async function requireAdmin(): Promise<
  | { ok: true; adminUserId: string }
  | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }
  const role = await getAdminRole(session.user.id);
  if (role !== "super_admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }
  return { ok: true, adminUserId: session.user.id };
}