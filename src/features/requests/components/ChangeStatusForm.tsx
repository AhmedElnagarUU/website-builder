"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui";
import type { RequestStatus } from "@/features/requests/types";

const STATUS_OPTIONS: RequestStatus[] = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "cancelled",
];

export function ChangeStatusForm({
  siteId,
  locale,
  requestId,
  currentStatus,
}: {
  siteId: string;
  locale: string;
  requestId: string;
  currentStatus: RequestStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting || status === currentStatus) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        `/${locale}/sites/${siteId}/requests/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-end gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as RequestStatus)}
        className="rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      <Button onClick={handleSubmit} disabled={isSubmitting || status === currentStatus}>
        {isSubmitting ? "Saving..." : "Update"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
