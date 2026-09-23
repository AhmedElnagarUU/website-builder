"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui";

type PublicService = { _id: string; name: string };

function extractSlug(pathname: string): string {
  // Live site URL: /live/[slug]/[lang]/[pageSlug]
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "live" && parts[1]) return parts[1];
  return "";
}

export function ServiceRequestForm() {
  const pathname = usePathname();
  const slug = extractSlug(pathname);
  const apiBase = `/api/live/${slug}`;

  const [services, setServices] = useState<PublicService[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void fetch(`${apiBase}/services`)
      .then((r) => r.json())
      .then((d) => {
        if (d.services) setServices(d.services);
      })
      .catch(() => {
        /* non-critical: form still works without service dropdown */
      });
  }, [slug, apiBase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !slug) return;
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`${apiBase}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        serviceId: selectedService || undefined,
        message: message.trim(),
      }),
    });

    if (res.status === 429) {
      setError("Too many requests. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setName("");
    setEmail("");
    setPhone("");
    setSelectedService("");
    setMessage("");
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl rounded-[4px] border-2 border-ink bg-paper-2 p-8 text-center shadow-mono">
        <h3 className="mono-display text-lg font-semibold text-ink">
          Thank you!
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          Your message has been sent. We will get back to you soon.
        </p>
      </div>
    );
  }

  if (!slug) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Name *
          </label>
          <input
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink mb-1">
          Phone
        </label>
        <input
          type="tel"
          maxLength={40}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
        />
      </div>

      {services.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Service Interested In
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
          >
            <option value="">General Inquiry</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-ink mb-1">
          Message *
        </label>
        <textarea
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
