import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import {
  getAccountStatus,
  resolveSubscriptionForUser,
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
  error: "limit_reached" | "requires_upgrade" | "account_frozen" | "account_suspended";
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

  const subscription = await resolveSubscriptionForUser(session.user.id);
  const accountStatus = await getAccountStatus(session.user.id);
  const plan = getPlanById(subscription.planId);
  if (!plan) {
    return NextResponse.json(
      { error: "unknown_plan" },
      { status: 500 }
    );
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
    { plan, accountStatus },
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