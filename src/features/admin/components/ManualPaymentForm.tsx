"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ManualPaymentForm({
  userId,
  onRecorded,
}: {
  userId: string;
  onRecorded: () => void;
}) {
  const t = useTranslations("admin.users.payment_form");
  const [kind, setKind] = useState("manual_payment");
  const [amountMinor, setAmountMinor] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const amount = parseInt(amountMinor, 10);
    if (isNaN(amount) || amount === 0) {
      setError(t("error_amount"));
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/admin/users/${userId}/billing/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        amountMinor: amount,
        currency: currency.toUpperCase(),
        description: description || undefined,
      }),
    });

    if (res.ok) {
      setAmountMinor("");
      setDescription("");
      onRecorded();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="mono-display text-lg font-bold text-ink">{t("title")}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_kind")}
          </label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          >
            <option value="manual_payment">{t("kind_payment")}</option>
            <option value="manual_discount">{t("kind_discount")}</option>
            <option value="credit">{t("kind_credit")}</option>
            <option value="write_off">{t("kind_writeoff")}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_amount")}
          </label>
          <input
            type="number"
            value={amountMinor}
            onChange={(e) => setAmountMinor(e.target.value)}
            placeholder="e.g. 1999"
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink placeholder:text-ink-3"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold text-ink">
            {t("label_currency")}
          </label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            maxLength={3}
            className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-body text-xs font-semibold text-ink">
          {t("label_description")}
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("description_placeholder")}
          className="flex h-11 w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink placeholder:text-ink-3"
        />
      </div>

      {error && <p className="font-body text-sm text-mono-red">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full border-2 border-ink bg-ink px-5 py-2 font-display text-sm font-semibold text-paper transition-colors hover:bg-transparent hover:text-ink disabled:opacity-50"
      >
        {loading ? "…" : t("submit")}
      </button>
    </form>
  );
}
