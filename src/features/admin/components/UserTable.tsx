"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";

interface UserRow {
  _id: string;
  email: string;
  name: string | null;
  createdAt: string;
  role: string;
  accountStatus: string;
  planId: string;
  subscriptionStatus: string;
}

interface UsersResponse {
  users: UserRow[];
  total: number;
  page: number;
  totalPages: number;
}

export function UserTable({ locale }: { locale: string }) {
  const t = useTranslations("admin.users");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(
    async (q: string, page = 1) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        setData(await res.json());
      }
      setLoading(false);
    },
    []
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    router.push(`/${locale}/admin/users?${params}`);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="flex h-11 flex-1 rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className="rounded-full border-2 border-ink bg-ink px-5 py-2 font-display text-sm font-semibold text-paper transition-colors hover:bg-transparent hover:text-ink"
        >
          {t("search")}
        </button>
      </form>

      {data && (
        <p className="mb-4 font-serif2 text-sm text-ink-2">
          {t("total_count", { count: data.total })}
        </p>
      )}

      {loading && (
        <p className="font-serif2 text-ink-2">{t("loading")}</p>
      )}

      {data && !loading && (
        <div className="overflow-x-auto rounded-[4px] border-[1.5px] border-ink">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-ink bg-paper-2">
                <th className="px-4 py-3 text-start font-display text-sm font-semibold text-ink">
                  {t("col_email")}
                </th>
                <th className="px-4 py-3 text-start font-display text-sm font-semibold text-ink">
                  {t("col_name")}
                </th>
                <th className="px-4 py-3 text-start font-display text-sm font-semibold text-ink">
                  {t("col_plan")}
                </th>
                <th className="px-4 py-3 text-start font-display text-sm font-semibold text-ink">
                  {t("col_status")}
                </th>
                <th className="px-4 py-3 text-start font-display text-sm font-semibold text-ink">
                  {t("col_account_status")}
                </th>
                <th className="px-4 py-3 text-start font-display text-sm font-semibold text-ink">
                  {t("col_role")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-ink/10 transition-colors hover:bg-paper-2"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/${locale}/admin/users/${user._id}`}
                      className="font-body text-sm font-semibold text-mono-red underline-offset-2 hover:underline"
                    >
                      {user.email}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ink">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 font-display text-xs font-semibold ${
                        user.planId === "pro"
                          ? "border-mono-red bg-mono-red text-paper"
                          : "border-ink bg-transparent text-ink"
                      }`}
                    >
                      {user.planId}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ink">
                    {user.subscriptionStatus}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.accountStatus} />
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ink">
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => fetchUsers(query, p)}
                className={`rounded-full border-2 px-3 py-1 font-display text-sm font-semibold transition-colors ${
                  p === data.page
                    ? "border-ink bg-ink text-paper"
                    : "border-ink bg-transparent text-ink hover:bg-ink/10"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      )}

      {!data && !loading && (
        <button
          onClick={() => fetchUsers("")}
          className="rounded-full border-2 border-ink bg-ink px-5 py-2 font-display text-sm font-semibold text-paper transition-colors hover:bg-transparent hover:text-ink"
        >
          {t("load_users")}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "border-emerald-600 text-emerald-600",
    frozen: "border-amber-500 text-amber-500",
    suspended: "border-mono-red text-mono-red",
  };
  return (
    <span
      className={`inline-block rounded-full border-2 px-2 py-0.5 font-display text-xs font-semibold ${
        colors[status] ?? "border-ink text-ink"
      }`}
    >
      {status}
    </span>
  );
}
