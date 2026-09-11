"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface SubscriptionData {
  planId: string;
  status: string;
  currency?: string;
  amountMinorUnits?: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export function SubscriptionEditor({
  userId,
  subscription,
  onUpdated,
}: {
  userId: string;
  subscription: SubscriptionData;
  onUpdated: () => void;
}) {
  const t = useTranslations("admin.users.subscription_editor");
  const [planId, setPlanId] = useState(subscription.planId);
  const [status, setStatus] = useState(subscription.status);
  const [periodStart, setPeriodStart] = useState(
    subscription.currentPeriodStart
      ? new Date(subscription.currentPeriodStart).toISOString().slice(0, 10)
      : ""
  );
  const [periodEnd, setPeriodEnd] = useState(
    subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd).toISOString().slice(0, 10)
      : ""
  );
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(
    subscription.cancelAtPeriodEnd ?? false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setLoading(true);
    setError(null);

    const body: Record<string, unknown> = { planId, status };
    if (periodStart) body.currentPeriodStart = new Date(periodStart).toISOString();
    if (periodEnd) body.currentPeriodEnd = new Date(periodEnd).toISOString();
    body.cancelAtPeriodEnd = cancelAtPeriodEnd;

    const res = await fetch(`/api/admin/users/${userId}/subscription`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setConfirm(false);
      onUpdated();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="mono-display text-lg font-bold text-ink">{t("title")}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_plan")}
          </label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_status")}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          >
            <option value="active">active</option>
            <option value="trialing">trialing</option>
            <option value="past_due">past_due</option>
            <option value="canceled">canceled</option>
            <option value="ended">ended</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_period_start")}
          </label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_period_end")}
          </label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={cancelAtPeriodEnd}
          onChange={(e) => setCancelAtPeriodEnd(e.target.checked)}
          className="h-4 w-4 rounded border-2 border-ink"
        />
        <span className="font-body text-sm text-ink">{t("label_cancel_at_end")}</span>
      </label>

      {error && (
        <p className="font-body text-sm text-mono-red">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`rounded-full border-2 px-5 py-2 font-display text-sm font-semibold transition-colors disabled:opacity-50 ${
          confirm
            ? "border-mono-red bg-mono-red text-paper hover:border-ink hover:bg-ink"
            : "border-ink bg-ink text-paper hover:bg-transparent hover:text-ink"
        }`}
      >
        {loading ? "…" : confirm ? t("confirm_save") : t("save")}
      </button>
      {confirm && (
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="ms-2 rounded-full border-2 border-ink px-5 py-2 font-display text-sm font-semibold text-ink"
        >
          {t("cancel")}
        </button>
      )}
    </form>
  );
}
