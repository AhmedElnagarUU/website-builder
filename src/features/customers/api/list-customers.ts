import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  countRequestsForCustomers,
  listCustomersForSite,
  searchCustomers,
  toCustomerListItemDTO,
} from "@/features/customers/repository";
import type { CustomerListItemDTO } from "@/features/customers/types";

export type ListCustomersResult =
  | { ok: true; customers: CustomerListItemDTO[] }
  | { ok: false; error: "unauthorized" | "not_found" };

export async function listCustomersForCurrentUser(
  siteId: string,
  search?: string
): Promise<ListCustomersResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const customers = search
    ? await searchCustomers(siteId, search)
    : await listCustomersForSite(siteId);

  const requestCounts = await countRequestsForCustomers(
    customers.map((c) => c._id.toString())
  );

  const items: CustomerListItemDTO[] = customers.map((c) =>
    toCustomerListItemDTO(c, requestCounts.get(c._id.toString()) ?? 0)
  );

  return { ok: true, customers: items };
}
