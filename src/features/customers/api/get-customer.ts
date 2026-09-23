import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  countRequestsForCustomer,
  getCustomerForOwner,
  toCustomerDTO,
} from "@/features/customers/repository";
import type { CustomerDTO } from "@/features/customers/types";

export type GetCustomerResult =
  | { ok: true; customer: CustomerDTO; requestCount: number }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function getCustomerForCurrentUser(
  siteId: string,
  customerId: string
): Promise<GetCustomerResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const customer = await getCustomerForOwner(
    customerId,
    siteId,
    session.user.id
  );
  if (!customer) return { ok: false, error: "not_found" };

  const requestCount = await countRequestsForCustomer(customerId);

  return {
    ok: true,
    customer: toCustomerDTO(customer),
    requestCount,
  };
}
