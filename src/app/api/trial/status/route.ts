import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { getTrialStatus, getAccountStatus } from "@/features/monetization/repository";

/**
 * GET /api/trial/status
 * Returns the current user's trial status and account state.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const trial = await getTrialStatus(session.user.id);
  const accountStatus = await getAccountStatus(session.user.id);

  return NextResponse.json({
    trial,
    accountStatus,
    isSuspended: accountStatus === "suspended",
  });
}
