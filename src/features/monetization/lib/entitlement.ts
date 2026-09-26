import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import {
  enforceTrialStatus,
  getAccountStatus,
  resolveSubscriptionForUser,
  restoreAccount,
  getTrialStatus,
} from "../repository";
import { getPlanById } from "../plans";
import { checkLimit } from "./checkLimit";
import { getUsageForUser } from "./usage";
import type {
  CheckLimitRejected,
  LimitKey,
  RequestedScope,
  Subscription,
  UsageSnapshot,
} from "../types";

export interface EntitlementErrorBody {
  error: "limit_reached" | "requires_upgrade" | "account_frozen" | "account_suspended" | "trial_expired";
  plan: "free" | "pro";
  limitKey: LimitKey;
}

export interface EntitlementContext {
  siteId?: string;
  limitKey: LimitKey;
  requestedScope?: RequestedScope;
}

export interface EntitlementGranted {
  user: { id: string; email: string; name?: string };
  subscription: Subscription;
  usage: UsageSnapshot;
}

export function entitlementErrorResponse(
  result: CheckLimitRejected,
  planId: "free" | "pro"
): NextResponse {
  const body: EntitlementErrorBody = {
    error: result.reason,
    plan: planId,
    limitKey: result.limitKey,
  };
  const status =
    result.reason === "account_frozen" || result.reason === "account_suspended"
      ? 403
      : 402;
  return NextResponse.json(body, { status });
}

export async function withEntitlement<THandler extends (ctx: EntitlementGranted) => Promise<Response>>(
  context: EntitlementContext,
  handler: THandler
): Promise<Response> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Lazy trial enforcement: if the user's trial just expired, suspend
  // their account immediately. Any subsequent checkLimit call will
  // return account_suspended (403).
  await enforceTrialStatus(session.user.id);

  const subscription = await resolveSubscriptionForUser(session.user.id);
  const accountStatus = await getAccountStatus(session.user.id);

  // If the user's subscription is active (paid) but their account is
  // suspended from trial expiry, restore access automatically.
  if (accountStatus === "suspended" && subscription.status === "active") {
    await restoreAccount(session.user.id);
  }

  // Re-fetch accountStatus after potential restoration so checkLimit
  // and the trial-expiration check see the latest value.
  const currentAccountStatus = await getAccountStatus(session.user.id);

  const plan = getPlanById(subscription.planId);
  if (!plan) {
    return NextResponse.json(
      { error: "unknown_plan" },
      { status: 500 }
    );
  }

  // Explicit trial-expiration check: return a clear trial_expired error
  // (402) so the UI can show an upgrade CTA instead of a generic
  // "account suspended" message.
  if (currentAccountStatus === "suspended") {
    const trial = await getTrialStatus(session.user.id);
    if (trial.hasTrial && trial.isExpired) {
      return NextResponse.json(
        {
          error: "trial_expired",
          plan: subscription.planId,
          limitKey: context.limitKey,
        },
        { status: 402 }
      );
    }
  }

  const usage = await getUsageForUser(session.user.id);
  const perSiteLimit =
    context.limitKey === "maxPagesPerSite" ||
    context.limitKey === "maxLanguages" ||
    context.limitKey === "maxPublishedSites";
  const requestedScope =
    context.requestedScope !== undefined || context.siteId === undefined || !perSiteLimit
      ? context.requestedScope
      : { siteId: context.siteId, amount: 1 };
  const result = checkLimit(
    { plan, accountStatus: currentAccountStatus },
    usage,
    context.limitKey,
    requestedScope
  );

  if (!result.ok) {
    return entitlementErrorResponse(result, plan.id);
  }

  return handler({
    user: session.user,
    subscription,
    usage,
  });
}