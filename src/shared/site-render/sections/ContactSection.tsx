import { useTranslations } from "next-intl";
import { F } from "../internals";
import { useSiteStyle } from "../context";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";
import { ServiceRequestForm } from "@/features/requests/components/ServiceRequestForm";

function getSigName(signature?: string): string {
  if (!signature) return "";
  const s = signature.toLowerCase();
  if (s.includes("ticket")) return "redline";
  if (s.includes("text-stroke")) return "volatile";
  if (s.includes("charred")) return "ember";
  if (s.includes("asymmetric") || s.includes("playfair")) return "atelier";
  if (s.includes("gold")) return "meridian";
  if (s.includes("specimen")) return "arbor";
  if (s.includes("12px radius")) return "clearview";
  if (s.includes("ledger")) return "harlan";
  if (s.includes("stat-border") || s.includes("amber")) return "ironclad";
  if (s.includes("contact sheet")) return "mara";
  return "";
}

type ContactRow = { label: string; node?: React.ReactNode };

function ContactBody({ content, className = "", style }: { content: SectionRenderProps["content"]; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={`site-body leading-relaxed ${className}`} style={style}>
      <F fieldKey="contact_body" content={content} fallback="" />
    </p>
  );
}

function RedlineContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <span
            className="flex items-center gap-3 text-xs uppercase"
            style={{ color: "var(--signal)", fontFamily: "var(--font-mono)", letterSpacing: "0.25em" }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-4xl font-bold uppercase tracking-tight @5xl:text-5xl"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "color-mix(in srgb, var(--ink) 75%, transparent)" }} />
        </div>
        <div
          className="self-center p-8"
          style={{ backgroundColor: "var(--ticket)", border: "1.5px solid var(--ink)", boxShadow: "6px 6px 0 0 var(--ink)" }}
        >
          <dl className="flex flex-col gap-6 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline gap-3">
                <dt className="text-xs uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--signal)", letterSpacing: "0.15em" }}>
                  {row.label}
                </dt>
                <dd className="site-body" style={{ color: "var(--ink)" }}>{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function VolatileContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="relative overflow-hidden py-24" style={{ backgroundColor: "var(--vol-surface)", color: "var(--vol-text)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <span
            className="text-xs font-semibold uppercase"
            style={{ color: "var(--vol-accent)", letterSpacing: "0.18em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-4xl font-bold tracking-[-0.02em] @5xl:text-5xl"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "var(--vol-muted)" }} />
        </div>
        <div className="self-center" style={{ backgroundColor: "var(--vol-surface-light)", border: "1px solid var(--vol-border)" }}>
          <dl className="flex flex-col">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex flex-wrap items-baseline gap-3 p-6 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "var(--vol-border)" }}
              >
                <dt className="text-xs font-semibold uppercase" style={{ color: "var(--vol-accent)", letterSpacing: "0.15em" }}>
                  {row.label}
                </dt>
                <dd className="site-body" style={{ color: "var(--vol-text)" }}>{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function EmberContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--coal)", color: "var(--crema)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start gap-4">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--flame)", fontFamily: "var(--font-mono)", letterSpacing: "0.24em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-4xl font-medium leading-[1]"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "color-mix(in srgb, var(--crema) 70%, transparent)" }} />
        </div>
        <dl
          className="flex flex-col gap-5 self-center"
          style={{ border: "1px solid color-mix(in srgb, var(--line) 40%, transparent)" }}
        >
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-baseline gap-3 px-6 py-5">
              <dt className="flex items-center gap-2 text-xs uppercase" style={{ color: "var(--flame)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                <span aria-hidden="true">&loz;</span>
                {row.label}
              </dt>
              <dd className="site-body" style={{ color: "color-mix(in srgb, var(--crema) 85%, transparent)" }}>{row.node}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function MeridianContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--cream-light)", color: "var(--navy)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="site-sig-gold-line" />
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-4xl font-light tracking-[0.02em]"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "color-mix(in srgb, var(--navy) 75%, transparent)" }} />
        </div>
        <div
          className="self-center p-8"
          style={{ backgroundColor: "#fff", border: "1px solid color-mix(in srgb, var(--gold) 30%, transparent)" }}
        >
          <dl className="flex flex-col gap-6 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline gap-3 py-3" style={{ borderBottom: "1px solid color-mix(in srgb, var(--gold) 20%, transparent)" }}>
                <dt className="text-sm italic" style={{ fontFamily: "var(--font-serif2)", color: "var(--gold)" }}>
                  {row.label}
                </dt>
                <dd className="site-body" style={{ color: "var(--navy)" }}>{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function ArborContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-5">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--moss)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="max-w-md text-4xl font-light leading-[1]"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "var(--moss)" }} />
        </div>
        <div className="site-sig-specimen flex flex-col gap-4 self-center p-6">
          <span
            className="text-[9px] uppercase"
            style={{ color: "var(--clay)", letterSpacing: "0.15em", fontFamily: "var(--font-mono)" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <dl className="flex flex-col gap-4">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--line)" }}>
                <dt className="text-xs uppercase" style={{ color: "var(--clay)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                  {row.label}
                </dt>
                <dd className="site-body text-xs" style={{ color: "var(--ink)" }}>{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function ClearviewContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-3xl font-extrabold tracking-tight @5xl:text-4xl"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "var(--clinic-muted)" }} />
        </div>
        <dl
          className="flex flex-col gap-4 self-center rounded-[12px] p-8"
          style={{ backgroundColor: "#fff", border: "1px solid var(--clinic-border)" }}
        >
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                style={{ backgroundColor: "rgba(8, 145, 178, 0.1)", color: "var(--clinic-teal)" }}
                aria-hidden="true"
              >
                &middot;
              </span>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase" style={{ color: "var(--clinic-muted)", letterSpacing: "0.1em" }}>
                  {row.label}
                </dt>
                <dd className="site-body" style={{ color: "var(--clinic-teal)" }}>{row.node}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HarlanContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--paper)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <span
            className="text-[0.7rem] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.24em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="text-4xl font-light leading-[1.05]"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "color-mix(in srgb, var(--paper) 75%, transparent)" }} />
        </div>
        <div className="site-sig-ledger self-center">
          <span
            className="border-b px-5 py-3 text-[0.7rem] uppercase"
            style={{ borderColor: "var(--line)", color: "var(--brass)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <dl className="flex flex-col">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "color-mix(in srgb, var(--line) 70%, transparent)" }}
              >
                <dt className="text-[0.7rem] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.15em" }}>
                  {row.label}
                </dt>
                <dd className="site-body text-sm" style={{ color: "var(--paper)" }}>{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function IroncladContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--iron-black)", color: "var(--iron-text)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <span
            className="flex items-center gap-3 text-xs font-semibold uppercase"
            style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}
          >
            <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="max-w-lg text-4xl font-extrabold uppercase leading-[0.95]"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "var(--iron-muted)" }} />
        </div>
        <dl
          className="flex flex-col self-center"
          style={{ border: "1px solid var(--iron-border)", backgroundColor: "var(--iron-surface)" }}
        >
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-baseline gap-3 p-6">
              <dt className="flex items-center gap-3 text-xs font-bold uppercase" style={{ color: "var(--iron-amber)", letterSpacing: "0.15em" }}>
                <span className="inline-block h-2 w-2" style={{ backgroundColor: "var(--iron-amber)" }} />
                {row.label}
              </dt>
              <dd className="site-body" style={{ color: "var(--iron-text)" }}>{row.node}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function MaraContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--ink)", color: "var(--bone)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start gap-4">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--red)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="max-w-md text-4xl font-light leading-[0.96]"
            fallback=""
          />
          <ContactBody content={content} className="max-w-md" style={{ color: "color-mix(in srgb, var(--bone) 75%, transparent)" }} />
        </div>
        <dl
          className="flex flex-col self-center border"
          style={{ borderColor: "color-mix(in srgb, var(--line) 50%, transparent)" }}
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex flex-wrap items-baseline gap-3 px-6 py-5 ${i > 0 ? "border-t" : ""}`}
              style={{ borderColor: "color-mix(in srgb, var(--line) 50%, transparent)" }}
            >
              <dt className="flex items-center gap-2 text-xs uppercase" style={{ color: "var(--red)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                <span className="inline-block h-2 w-2" style={{ backgroundColor: "var(--red)" }} aria-hidden="true" />
                {row.label}
              </dt>
              <dd className="site-body" style={{ color: "var(--bone)" }}>{row.node}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function AtelierContact({ content, rows }: { content: SectionRenderProps["content"]; rows: ContactRow[] }) {
  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--warm-surface)", color: "var(--warm-text)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @4xl:grid-cols-5 @4xl:gap-16">
        <div className="flex flex-col items-start gap-4 @4xl:col-span-2">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}
          >
            <F fieldKey="nav_contact" content={content} fallback="" />
          </span>
          <F
            fieldKey="contact_heading"
            content={content}
            as="h2"
            className="max-w-sm text-4xl font-medium italic leading-[1.05]"
            fallback=""
          />
        </div>
        <div
          className="self-center @4xl:col-span-3"
          style={{ border: "1px solid var(--warm-border)", backgroundColor: "var(--warm-bg)", boxShadow: "0 20px 50px -30px rgba(51, 29, 17, 0.45)" }}
        >
          <ContactBody content={content} className="px-8 pt-8" style={{ color: "var(--warm-muted)" }} />
          <dl className="flex flex-col gap-4 p-8">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline gap-3">
                <dt className="text-xs uppercase" style={{ color: "var(--warm-accent)", letterSpacing: "0.2em" }}>
                  {row.label}
                </dt>
                <dd className="site-body text-lg" style={{ color: "var(--warm-text)" }}>{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ content, businessInfo }: SectionRenderProps) {
  const t = useTranslations("site");
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { theme } = style;

  const rows: ContactRow[] = [];
  if (businessInfo.contactPhone) {
    rows.push({
      label: t("labels.tel"),
      node: (
        <a href={`tel:${businessInfo.contactPhone}`} className="underline underline-offset-2">
          {businessInfo.contactPhone}
        </a>
      ),
    });
  }
  if (businessInfo.contactEmail) {
    rows.push({
      label: t("labels.email"),
      node: (
        <a href={`mailto:${businessInfo.contactEmail}`} className="underline underline-offset-2">
          {businessInfo.contactEmail}
        </a>
      ),
    });
  }
  if (businessInfo.location) {
    rows.push({ label: t("labels.address"), node: <span>{businessInfo.location}</span> });
  }

  let inner: React.ReactNode;

  if (sig === "redline") {
    inner = <RedlineContact content={content} rows={rows} />;
  } else if (sig === "volatile") {
    inner = <VolatileContact content={content} rows={rows} />;
  } else if (sig === "ember") {
    inner = <EmberContact content={content} rows={rows} />;
  } else if (sig === "meridian") {
    inner = <MeridianContact content={content} rows={rows} />;
  } else if (sig === "arbor") {
    inner = <ArborContact content={content} rows={rows} />;
  } else if (sig === "clearview") {
    inner = <ClearviewContact content={content} rows={rows} />;
  } else if (sig === "harlan") {
    inner = <HarlanContact content={content} rows={rows} />;
  } else if (sig === "ironclad") {
    inner = <IroncladContact content={content} rows={rows} />;
  } else if (sig === "mara") {
    inner = <MaraContact content={content} rows={rows} />;
  } else if (sig === "atelier") {
    inner = <AtelierContact content={content} rows={rows} />;
  } else {
    inner = (
    <section id="contact" className="py-20">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 @4xl:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4">
          <SectionHead fieldKey="contact_heading" content={content} align="start" />
          <ContactBody content={content} className="max-w-xl" />
        </div>
        <div
          className={`bg-card p-8 text-foreground ${
            theme.accentRole === "edge"
              ? "rounded border-s-4 shadow-sm"
              : "rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
          }`}
          style={theme.accentRole === "edge" ? { borderInlineStartColor: "var(--brand)" } : undefined}
        >
          <dl className="flex flex-col gap-5 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <dt className="site-body font-semibold text-foreground">{row.label}</dt>
                <dd className="site-body text-muted-foreground">{row.node}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
  }

  return (
    <>
      {inner}
      <div className="mx-auto max-w-5xl px-4 pb-12">
        <ServiceRequestForm />
      </div>
    </>
  );
}