"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui";

export function AddNoteForm({
  siteId,
  locale,
  requestId,
}: {
  siteId: string;
  locale: string;
  requestId: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;

    try {
      const res = await fetch(
        `/${locale}/sites/${siteId}/requests/${requestId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong");
      }
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <textarea
        name="note"
        placeholder="Add an internal note..."
        rows={2}
        maxLength={1000}
        required
        className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Note"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
