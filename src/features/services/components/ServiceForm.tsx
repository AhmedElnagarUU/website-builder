"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui";
import type { ServiceDTO } from "@/features/services/types";

interface ServiceFormProps {
  siteId: string;
  locale: string;
  editing?: ServiceDTO | null;
  onCancel?: () => void;
}

export function ServiceForm({ siteId, locale, editing, onCancel }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!editing;
  const action = isEdit
    ? `/${locale}/sites/${siteId}/services/${editing._id}`
    : `/${locale}/sites/${siteId}/services`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      active: (form.elements.namedItem("active") as HTMLInputElement).checked,
      ...(isEdit && { sortOrder: parseInt((form.elements.namedItem("sortOrder") as HTMLInputElement).value, 10) }),
    };

    try {
      const res = await fetch(action, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong");
      }
      router.refresh();
      if (onCancel) onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
      <h3 className="mono-display text-lg font-semibold text-ink mb-3">
        {isEdit ? "Edit Service" : "Add Service"}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-ink mb-1">Name</label>
          <input
            name="name"
            type="text"
            defaultValue={editing?.name ?? ""}
            required
            maxLength={100}
            className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={editing?.description ?? ""}
            maxLength={2000}
            rows={3}
            className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            name="active"
            type="checkbox"
            defaultChecked={editing?.active ?? true}
            id="active"
            className="h-4 w-4"
          />
          <label htmlFor="active" className="text-sm text-ink">Active</label>
        </div>

        {isEdit && (
          <div>
            <label className="block text-xs font-medium text-ink mb-1">Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={editing?.sortOrder ?? 0}
              min={0}
              className="w-16 rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
            />
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="default" onClick={onCancel}>
          Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
