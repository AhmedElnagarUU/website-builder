import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  countRequestsForCustomer,
  deleteCustomer,
  getCustomerForOwner,
} from "@/features/customers/repository";

export type DeleteCustomerResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" | "conflict" };

export async function deleteCustomerForCurrentUser(
  siteId: string,
  customerId: string
): Promise<DeleteCustomerResult> {
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

  if ((await countRequestsForCustomer(customerId)) > 0) {
    return { ok: false, error: "conflict" };
  }

  await deleteCustomer(customerId, siteId);
  return { ok: true };
}
