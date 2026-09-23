import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getRequestForCurrentUser } from "@/features/requests/api/get-request";
import { ChangeStatusForm } from "@/features/requests/components/ChangeStatusForm";
import { AddNoteForm } from "@/features/requests/components/AddNoteForm";
import { SectionHead } from "@/shared/ui";
import type { Locale } from "@/features/sites/types";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    siteId: string;
    requestId: string;
  }>;
}) {
  const { locale, siteId, requestId } = await params;
  const t = await getTranslations("business");
  const l = locale as Locale;

  const result = await getRequestForCurrentUser(siteId, requestId);
  if (!result.ok) notFound();
  const req = result.request;

  return (
    <div>
      <SectionHead
        title={`${t("requests.request_id")} #${req._id.slice(-6).toUpperCase()}`}
        className="mb-6"
      />

      <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
        <h3 className="mono-display text-sm font-semibold text-ink mb-3">
          {t("requests.customer")}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-ink">{req.customerName}</p>
          <p className="text-sm text-ink/80">{req.customerEmail ?? "—"}</p>
          <p className="text-sm text-ink/80">{req.customerPhone ?? "—"}</p>
        </div>
      </div>

      <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
        <h3 className="mono-display text-sm font-semibold text-ink mb-3">
          {t("requests.service")}
        </h3>
        <p className="text-sm text-ink">{req.serviceName ?? "—"}</p>
      </div>

      <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
        <h3 className="mono-display text-sm font-semibold text-ink mb-3">
          {t("requests.message")}
        </h3>
        <p className="text-sm text-ink/80 whitespace-pre-wrap">
          {req.message || "—"}
        </p>
      </div>

      <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
        <h3 className="mono-display text-sm font-semibold text-ink mb-3">
          {t("requests.status")}
        </h3>
        <ChangeStatusForm
          siteId={siteId}
          locale={l}
          requestId={requestId}
          currentStatus={req.status}
        />
      </div>

      {req.internalNotes.length > 0 && (
        <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
          <h3 className="mono-display text-sm font-semibold text-ink mb-3">
            {t("requests.internal_notes")}
          </h3>
          <div className="space-y-2">
            {req.internalNotes.map((note) => (
              <div key={note._id} className="rounded-[4px] border border-ink bg-paper px-3 py-2">
                <p className="text-sm text-ink/80">{note.note}</p>
                <p className="text-xs text-ink/50">
                  {new Date(note.createdAt).toLocaleString()}
                  {" · "}
                  {note.createdBy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 rounded-[4px] border-2 border-ink bg-paper-2 p-4 shadow-mono">
        <h3 className="mono-display text-sm font-semibold text-ink mb-3">
          {t("requests.activity")}
        </h3>
        <div className="space-y-2">
          {req.statusHistory.map((entry, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-xs text-ink/50 min-w-[80px]">
                {new Date(entry.changedAt).toLocaleString()}
              </span>
              <span className="text-ink">
                Status: {t(`requests.status_values.${entry.status}`)}
              </span>
              <span className="text-ink/50">by {entry.changedBy}</span>
            </div>
          ))}
          {req.internalNotes.map((note) => (
            <div key={note._id} className="flex gap-3 text-sm">
              <span className="text-xs text-ink/50 min-w-[80px]">
                {new Date(note.createdAt).toLocaleString()}
              </span>
              <span className="text-ink">Note added</span>
            </div>
          ))}
        </div>
      </div>

      <AddNoteForm siteId={siteId} locale={l} requestId={requestId} />
    </div>
  );
}
