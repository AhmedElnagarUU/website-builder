"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SubscriptionEditor } from "./SubscriptionEditor";
import { ManualPaymentForm } from "./ManualPaymentForm";

interface UserDetail {
  _id: string;
  email: string;
  name: string | null;
  role: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  subscription: {
    planId: string;
    status: string;
    currency?: string;
    amountMinorUnits?: number;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  } | null;
  sites: { total: number; published: number };
  billing: {
    records: Array<{
      _id: string;
      kind: string;
      amountMinor: number;
      currency: string;
      description?: string;
      createdAt: string;
    }>;
    totals: Array<{ currency: string; totalMinor: number; count: number }>;
  };
}

interface AuditEntry {
  _id: string;
  adminUserId: string;
  targetUserId: string;
  action: string;
  detail?: string;
  createdAt: string;
}

export function UserDetail({ userId }: { userId: string; locale: string }) {
  const t = useTranslations("admin.users.detail");
  const [user, setUser] = useState<UserDetail | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [userRes, auditRes] = await Promise.all([
      fetch(`/api/admin/users/${userId}`),
      fetch(`/api/admin/audit?userId=${userId}`),
    ]);
    if (userRes.ok) setUser(await userRes.json());
    if (auditRes.ok) {
      const d = await auditRes.json();
      setAudit(d.entries ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (status: string) => {
    setActionLoading(true);
    const res = await fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchData();
    }
    setConfirmAction(null);
    setActionLoading(false);
  };

  if (loading) {
    return <p className="font-serif2 text-ink-2">{t("loading")}</p>;
  }

  if (!user) {
    return <p className="font-serif2 text-ink-2">{t("not_found")}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
        <h2 className="mono-display mb-4 text-2xl font-bold text-ink">
          {t("profile")}
        </h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("field_email")} value={user.email} />
          <Field label={t("field_name")} value={user.name ?? "—"} />
          <Field label={t("field_role")} value={user.role} />
          <Field label={t("field_created")} value={new Date(user.createdAt).toLocaleDateString()} />
          <Field
            label={t("field_account_status")}
            value={
              <StatusBadge status={user.accountStatus} />
            }
          />
        </dl>
      </div>

      <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
        <h2 className="mono-display mb-4 text-2xl font-bold text-ink">
          {t("sites_title")}
        </h2>
        <p className="font-body text-sm text-ink">
          {t("sites_count", { total: user.sites.total, published: user.sites.published })}
        </p>
      </div>

      <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
        <h2 className="mono-display mb-4 text-2xl font-bold text-ink">
          {t("status_title")}
        </h2>
        <div className="flex flex-wrap gap-3">
          {["active", "frozen", "suspended"].map((status) => (
            <div key={status}>
              {confirmAction === status ? (
                <div className="flex items-center gap-2">
                  <span className="font-serif2 text-sm text-ink-2">
                    {t("confirm_change", { status })}
                  </span>
                  <button
                    onClick={() => handleStatusChange(status)}
                    disabled={actionLoading}
                    className="rounded-full border-2 border-mono-red bg-mono-red px-3 py-1 font-display text-xs font-semibold text-paper disabled:opacity-50"
                  >
                    {actionLoading ? "…" : t("confirm_yes")}
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="rounded-full border-2 border-ink px-3 py-1 font-display text-xs font-semibold text-ink"
                  >
                    {t("confirm_no")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmAction(status)}
                  disabled={user.accountStatus === status}
                  className={`rounded-full border-2 px-4 py-1.5 font-display text-sm font-semibold transition-colors disabled:opacity-40 ${
                    user.accountStatus === status
                      ? "border-ink bg-ink text-paper"
                      : "border-ink bg-transparent text-ink hover:bg-ink/10"
                  }`}
                >
                  {t(`status_${status}`)}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {user.subscription && (
        <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
          <h2 className="mono-display mb-4 text-2xl font-bold text-ink">
            {t("subscription_title")}
          </h2>
          <dl className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("field_plan")} value={user.subscription.planId} />
            <Field label={t("field_sub_status")} value={user.subscription.status} />
            {user.subscription.currency && (
              <Field
                label={t("field_amount")}
                value={`${(user.subscription.amountMinorUnits ?? 0) / 100} ${user.subscription.currency}`}
              />
            )}
            {user.subscription.currentPeriodStart && (
              <Field
                label={t("field_period_start")}
                value={new Date(user.subscription.currentPeriodStart).toLocaleDateString()}
              />
            )}
            {user.subscription.currentPeriodEnd && (
              <Field
                label={t("field_period_end")}
                value={new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
              />
            )}
          </dl>
          <div className="border-t border-dashed border-ink/20 pt-6">
            <SubscriptionEditor
              userId={userId}
              subscription={user.subscription}
              onUpdated={fetchData}
            />
          </div>
        </div>
      )}

      <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
        <h2 className="mono-display mb-4 text-2xl font-bold text-ink">
          {t("billing_title")}
        </h2>
        {user.billing.totals.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-3">
            {user.billing.totals.map((tot) => (
              <span
                key={tot.currency}
                className="rounded-full border-2 border-ink px-3 py-1 font-display text-sm font-semibold text-ink"
              >
                {t("billing_total", {
                  total: (tot.totalMinor / 100).toFixed(2),
                  currency: tot.currency,
                })}
              </span>
            ))}
          </div>
        ) : (
          <p className="mb-4 font-serif2 text-sm text-ink-2">{t("billing_empty")}</p>
        )}
        {user.billing.records.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="px-3 py-2 text-start font-display text-xs font-semibold text-ink">
                    {t("billing_col_date")}
                  </th>
                  <th className="px-3 py-2 text-start font-display text-xs font-semibold text-ink">
                    {t("billing_col_kind")}
                  </th>
                  <th className="px-3 py-2 text-start font-display text-xs font-semibold text-ink">
                    {t("billing_col_amount")}
                  </th>
                  <th className="px-3 py-2 text-start font-display text-xs font-semibold text-ink">
                    {t("billing_col_description")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.billing.records.map((rec) => (
                  <tr key={rec._id} className="border-b border-ink/10">
                    <td className="px-3 py-2 font-body text-xs text-ink">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-body text-xs text-ink">{rec.kind}</td>
                    <td className="px-3 py-2 font-body text-xs text-ink">
                      {(rec.amountMinor / 100).toFixed(2)} {rec.currency}
                    </td>
                    <td className="px-3 py-2 font-body text-xs text-ink-2">
                      {rec.description ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-dashed border-ink/20 pt-6">
          <ManualPaymentForm userId={userId} onRecorded={fetchData} />
        </div>
      </div>

      {audit.length > 0 && (
        <div className="rounded-[4px] border-[1.5px] border-ink bg-paper-2 p-6 shadow-mono">
          <h2 className="mono-display mb-4 text-2xl font-bold text-ink">
            {t("audit_title")}
          </h2>
          <div className="space-y-2">
            {audit.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between border-b border-ink/10 py-2"
              >
                <span className="font-body text-sm font-semibold text-ink">
                  {entry.action}
                </span>
                <span className="font-serif2 text-xs text-ink-2">
                  {entry.detail ?? "—"} · {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-serif2 text-xs text-ink-2">{label}</dt>
      <dd className="mt-0.5 font-body text-sm font-semibold text-ink">{value}</dd>
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
