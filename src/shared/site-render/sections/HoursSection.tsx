import { useTranslations } from "next-intl";
import { F } from "../internals";
import { useSiteStyle } from "../context";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

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

const DAY_KEYS = [
  "hours_monday",
  "hours_tuesday",
  "hours_wednesday",
  "hours_thursday",
  "hours_friday",
  "hours_saturday",
  "hours_sunday",
];

function HourValue({ fieldKey, content }: { fieldKey: string; content: SectionRenderProps["content"] }) {
  return <F fieldKey={fieldKey} content={content} fallback="—" className="site-body" />;
}

function HoursTitle({ content, className = "" }: { content: SectionRenderProps["content"]; className?: string }) {
  return <F fieldKey="hours_title" content={content} as="h2" className={`text-4xl font-bold tracking-tight ${className}`} fallback="" />;
}

function RedlineHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
          <HoursTitle content={content} className="uppercase" />
        </div>
        <div className="border p-6 @3xl:p-8" style={{ backgroundColor: "var(--ticket)", border: "1px solid var(--ink)", boxShadow: "6px 6px 0 0 var(--ink)" }}>
          <div className="flex flex-col">
            {DAY_KEYS.map((key, i) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3" style={{ borderTop: "1px solid color-mix(in srgb, var(--ink) 15%, transparent)" }}>
                <p className="flex items-center gap-3 text-sm uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", letterSpacing: "0.15em" }}>
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: i >= 5 ? "var(--signal)" : "var(--line)" }} />
                  {t(`days.${i}`)}
                </p>
                <p className="text-sm" style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: "var(--steel)" }}>
                  <HourValue fieldKey={key} content={content} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmberHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--soot)", color: "var(--crema)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-sm" style={{ color: "var(--flame)" }} aria-hidden="true">
            &loz;
          </span>
          <HoursTitle content={content} className="font-medium leading-[1]" />
        </div>
        <div className="border p-6 @3xl:p-8" style={{ backgroundColor: "var(--coal)", borderColor: "color-mix(in srgb, var(--line) 40%, transparent)" }}>
          <div className="flex flex-col">
            {DAY_KEYS.map((key, i) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: "1px solid color-mix(in srgb, var(--line) 40%, transparent)" }}>
                <p className="text-xs uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--flame)", letterSpacing: "0.2em" }}>
                  {t(`days.${i}`)}
                </p>
                <p className="text-sm" style={{ color: "var(--crema)", fontVariantNumeric: "tabular-nums" }}>
                  <HourValue fieldKey={key} content={content} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MeridianHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="site-sig-gold-line-wide" />
          <HoursTitle content={content} className="font-light tracking-[0.02em]" />
        </div>
        <div className="flex flex-col">
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-baseline justify-between gap-4 py-4" style={{ borderBottom: "1px solid var(--navy-border)" }}>
              <p className="text-sm uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--gold)", letterSpacing: "0.24em" }}>
                {t(`days.${i}`)}
              </p>
              <p className="text-lg font-light" style={{ color: "var(--cream)", fontVariantNumeric: "tabular-nums" }}>
                <HourValue fieldKey={key} content={content} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArborHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span className="inline-block" style={{ width: 44, height: 1, backgroundColor: "var(--clay)" }} />
          <HoursTitle content={content} className="font-light leading-[1]" />
        </div>
        <div className="site-sig-specimen p-6 @3xl:p-8">
          <div className="flex flex-col">
            {DAY_KEYS.map((key, i) => (
              <div key={key} className="flex items-baseline justify-between gap-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
                <p className="text-xs uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--moss)", letterSpacing: "0.18em" }}>
                  {String(i + 1).padStart(2, "0")}&nbsp;&middot;&nbsp;{t(`days.${i}`)}
                </p>
                <p className="site-body text-sm">
                  <HourValue fieldKey={key} content={content} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VolatileHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--vol-bg)", color: "var(--vol-text)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3 text-start">
          <HoursTitle content={content} className="tracking-[-0.02em]" />
        </div>
        <div className="border-t" style={{ borderColor: "var(--vol-border)" }}>
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-baseline justify-between gap-4 py-5" style={{ borderBottom: "1px solid var(--vol-border)" }}>
              <p className="text-xs font-semibold uppercase" style={{ color: "var(--vol-accent)", letterSpacing: "0.18em" }}>
                {t(`days.${i}`)}
              </p>
              <p className="site-body text-sm">
                <HourValue fieldKey={key} content={content} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClearviewHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <HoursTitle content={content} className="text-3xl font-extrabold tracking-tight @5xl:text-4xl" />
        </div>
        <div className="flex flex-col gap-3">
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-[12px] border px-6 py-4" style={{ backgroundColor: "var(--clinic-card)", borderColor: "var(--clinic-border)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--clinic-teal)" }}>
                {t(`days.${i}`)}
              </p>
              <p className="site-body text-sm">
                <HourValue fieldKey={key} content={content} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--navy)" }}>
      <div className="mx-auto max-w-[820px] px-4">
        <HoursTitle content={content} className="mb-8 text-4xl font-light leading-[1]" />
        <div className="site-sig-ledger p-8 @3xl:p-10">
          <div className="site-sig-ledger-rule mb-4" />
          <div className="flex flex-col">
            {DAY_KEYS.map((key, i) => (
              <div
                key={key}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-3"
                style={{ borderBottom: "1px dotted var(--line)" }}
              >
                <p className="text-xs uppercase" style={{ fontFamily: "var(--font-mono)", color: i >= 5 ? "var(--brass)" : "var(--navy)", letterSpacing: "0.2em" }}>
                  {t(`days.${i}`)}
                </p>
                <p className="text-sm" style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", minWidth: "5rem", textAlign: "end", color: "var(--navy)" }}>
                  <HourValue fieldKey={key} content={content} />
                </p>
              </div>
            ))}
          </div>
          <div className="site-sig-ledger-rule-thick mt-6" />
        </div>
      </div>
    </section>
  );
}

function IroncladHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--iron-black)", color: "var(--iron-text)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3">
          <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
          <HoursTitle content={content} className="max-w-3xl font-extrabold uppercase leading-[0.95]" />
        </div>
        <div className="flex flex-col gap-3">
          {DAY_KEYS.map((key, i) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border px-6 py-4"
              style={{ backgroundColor: "var(--iron-surface)", borderColor: "var(--iron-border)", borderInlineStartWidth: 3, borderInlineStartColor: "var(--iron-amber)" }}
            >
              <p className="text-xs font-bold uppercase" style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}>
                {t(`days.${i}`)}
              </p>
              <p className="site-body text-sm">
                <HourValue fieldKey={key} content={content} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaraHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--bone)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 @3xl:flex-row @3xl:items-baseline">
          <HoursTitle content={content} className="text-3xl font-light leading-[0.96]" />
          <span className="site-sig-plate" style={{ color: "var(--red)" }}>
            &numero;&nbsp;07
          </span>
        </div>
        <div className="site-sig-regs border p-8" style={{ borderColor: "var(--line)" }}>
          <div className="flex flex-col">
            {DAY_KEYS.map((key, i) => (
              <div key={key} className="flex items-baseline justify-between gap-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
                <p className="text-xs uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--red)", letterSpacing: "0.18em" }}>
                  {String(i + 1).padStart(2, "0")}&nbsp;&middot;&nbsp;{t(`days.${i}`)}
                </p>
                <p className="site-body text-sm">
                  <HourValue fieldKey={key} content={content} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AtelierHours({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  return (
    <section id="hours" className="py-24" style={{ backgroundColor: "var(--warm-bg)", color: "var(--warm-text)" }}>
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3">
          <span className="text-xs uppercase" style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}>
            &mdash;
          </span>
          <HoursTitle content={content} className="max-w-2xl font-medium leading-[1.05] @5xl:text-5xl" />
        </div>
        <div className="flex flex-col">
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-baseline justify-between gap-4 py-4" style={{ borderTop: "1px solid var(--warm-border)" }}>
              <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--warm-text)" }}>
                {t(`days.${i}`)}
              </p>
              <p className="text-lg italic" style={{ fontFamily: "var(--font-serif2)", color: "var(--warm-accent)" }}>
                <HourValue fieldKey={key} content={content} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HoursSection(props: SectionRenderProps) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { content } = props;
  const { theme } = style;
  const t = useTranslations("site");

  if (sig === "redline") return <RedlineHours {...props} />;
  if (sig === "volatile") return <VolatileHours {...props} />;
  if (sig === "ember") return <EmberHours {...props} />;
  if (sig === "meridian") return <MeridianHours {...props} />;
  if (sig === "arbor") return <ArborHours {...props} />;
  if (sig === "clearview") return <ClearviewHours {...props} />;
  if (sig === "harlan") return <HarlanHours {...props} />;
  if (sig === "ironclad") return <IroncladHours {...props} />;
  if (sig === "mara") return <MaraHours {...props} />;
  if (sig === "atelier") return <AtelierHours {...props} />;

  return (
    <section id="hours" className="py-20">
      <div className="mx-auto max-w-2xl px-4">
        <SectionHead fieldKey="hours_title" content={content} align="centered" />
        <div
          className={`divide-y divide-border ${theme.surface === "deep" ? "bg-card" : "bg-background"} rounded-lg border border-foreground/10`}
        >
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <p className="site-body font-medium">{t(`days.${i}`)}</p>
              <HourValue fieldKey={key} content={content} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}