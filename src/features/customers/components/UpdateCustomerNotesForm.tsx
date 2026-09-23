"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui";

interface UpdateCustomerNotesProps {
  siteId: string;
  locale: string;
  customerId: string;
}

export function UpdateCustomerNotesForm({
  siteId,
  locale,
  customerId,
  currentNotes,
}: UpdateCustomerNotesProps & {
  currentNotes: string[];
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(currentNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/${locale}/sites/${siteId}/customers/${customerId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
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

  const addNote = () => {
    const form = document.forms.namedItem("noteForm") as HTMLFormElement;
    const input = form.elements.namedItem("note") as HTMLTextAreaElement;
    const value = input.value.trim();
    if (value) {
      setNotes([...notes, value]);
      input.value = "";
    }
  };

  const removeNote = (idx: number) => {
    setNotes(notes.filter((_, i) => i !== idx));
  };

  return (
    <form name="noteForm" onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="block text-xs font-medium text-ink mb-1">
          Add Note
        </label>
        <textarea
          name="note"
          placeholder="Type a note and click Add..."
          rows={2}
          className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
        />
      </div>
      <Button type="button" variant="ghost" onClick={addNote}>
        Add Note
      </Button>
      <Button type="submit" disabled={isSubmitting} variant="ghost">
        {isSubmitting ? "Saving..." : "Save Notes"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {notes.length > 0 && (
        <div className="space-y-1 pt-2">
          {notes.map((note, i) => (
            <div
              key={i}
              className="rounded-[4px] border border-ink bg-paper-2 px-3 py-2 text-sm text-ink flex justify-between items-start"
            >
              <span className="flex-1 break-words">{note}</span>
              <button
                type="button"
                onClick={() => removeNote(i)}
                className="ml-2 text-xs text-red-500 hover:underline"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
