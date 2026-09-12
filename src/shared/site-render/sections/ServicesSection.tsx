import { F } from "../internals";
import { useSiteStyle, useSiteBrand } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead, SiteCard } from "../atoms";
import type { SectionRenderProps } from "./types";

type ServicesPass = Pick<SectionRenderProps, "section" | "content">;

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

function serviceRows(section: SectionRenderProps["section"]): number[] {
  return Array.from({ length: section.svcCount ?? 0 }, (_, i) => i + 1);
}

function ServiceText({
  fieldKey,
  content,
  className = "",
  style,
}: {
  fieldKey: string;
  content: SectionRenderProps["content"];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p className={className} style={style}>
      <F fieldKey={fieldKey} content={content} fallback="" />
    </p>
  );
}

function SignalEyebrow({ content }: { content: SectionRenderProps["content"] }) {
  return (
    <span
      className="flex items-center gap-3 text-xs uppercase"
      style={{
        color: "var(--signal)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.25em",
      }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
      <F fieldKey="nav_services" content={content} fallback="" />
    </span>
  );
}

function RedlineServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <SignalEyebrow content={content} />
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} text-4xl font-bold uppercase tracking-tight`}
            fallback=""
          />
        </div>
        <div className="flex flex-col">
          {serviceRows(section).map((n) => (
            <div
              key={n}
              className="border-t py-5"
              style={{ borderColor: "color-mix(in srgb, var(--ink) 15%, transparent)" }}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="shrink-0 text-sm"
                  style={{ color: "var(--signal)", fontFamily: "var(--font-mono)" }}
                >
                  {String(n).padStart(2, "0")}
                </span>
                <F
                  fieldKey={`service_${n}_title`}
                  content={content}
                  as="h3"
                  className={`${headingClass} min-w-0 flex-1 truncate text-2xl font-bold uppercase tracking-tight`}
                  fallback=""
                />
                <span className="site-sig-dots w-8 grow" />
                <span
                  className="shrink-0 text-sm"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--steel)",
                  }}
                >
                  &mdash;
                </span>
              </div>
              <ServiceText
                fieldKey={`service_${n}_description`}
                content={content}
                className="site-body mt-1 max-w-2xl ps-10 text-sm leading-relaxed"
                style={{ color: "var(--steel)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--vol-bg)", color: "var(--vol-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3 text-start">
          <span
            className="text-xs font-semibold uppercase"
            style={{ color: "var(--vol-accent)", letterSpacing: "0.18em" }}
          >
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-3xl text-4xl font-bold tracking-[-0.02em] @5xl:text-5xl`}
            fallback=""
          />
        </div>
        <div className="border-t" style={{ borderColor: "var(--vol-border)" }}>
          {serviceRows(section).map((n) => (
            <div
              key={n}
              className="flex flex-col justify-between gap-4 py-8 @5xl:flex-row @5xl:items-baseline"
              style={{ borderBottom: "1px solid var(--vol-border)" }}
            >
              <div className="flex flex-col items-start gap-3 @3xl:flex-row @3xl:gap-8">
                <span
                  className="shrink-0 text-sm font-semibold"
                  style={{ color: "var(--vol-accent)" }}
                >
                  {String(n).padStart(2, "0")}
                </span>
                <div className="max-w-xl">
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} text-2xl font-bold tracking-tight`}
                    fallback=""
                  />
                  <ServiceText
                    fieldKey={`service_${n}_description`}
                    content={content}
                    className="site-body mt-1 text-sm leading-relaxed"
                    style={{ color: "var(--vol-muted)" }}
                  />
                </div>
              </div>
              <span className="site-sig-text-stroke hidden shrink-0 text-6xl font-bold leading-none @5xl:block">
                {String(n).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmberServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--soot)", color: "var(--crema)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--flame)", fontFamily: "var(--font-mono)", letterSpacing: "0.24em" }}
          >
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-xl text-4xl font-medium leading-[1]`}
            fallback=""
          />
        </div>
        <div
          className="border p-8 md:p-12"
          style={{
            backgroundColor: "var(--coal)",
            borderColor: "color-mix(in srgb, var(--line) 40%, transparent)",
          }}
        >
          <div className="flex flex-col">
            {serviceRows(section).map((n) => (
              <div
                key={n}
                className="py-5"
                style={{ borderBottom: "1px solid color-mix(in srgb, var(--line) 40%, transparent)" }}
              >
                <div className="flex items-baseline gap-4">
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} min-w-0 text-xl`}
                    fallback=""
                  />
                  <span
                    className="grow"
                    style={{ borderBottom: "1px dotted var(--line)", translate: "0 -4px", opacity: 0.6 }}
                  />
                  <span
                    className="shrink-0 text-xs"
                    style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: "var(--flame)" }}
                  >
                    &mdash;
                  </span>
                </div>
                <ServiceText
                  fieldKey={`service_${n}_description`}
                  content={content}
                  className="site-body mt-1 text-sm leading-relaxed"
                  style={{ color: "color-mix(in srgb, var(--crema) 60%, transparent)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MeridianServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="site-sig-gold-line-wide" />
          <span
            className="text-xs uppercase"
            style={{ color: "var(--gold-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.3em" }}
          >
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} text-4xl font-light tracking-[0.02em]`}
            fallback=""
          />
        </div>
        <div className="flex flex-col">
          {serviceRows(section).map((n) => (
            <div key={n} className="py-5" style={{ borderBottom: "1px solid var(--navy-border)" }}>
              <div className="flex items-baseline gap-4">
                <F
                  fieldKey={`service_${n}_title`}
                  content={content}
                  as="h3"
                  className={`${headingClass} min-w-0 text-2xl font-light`}
                  fallback=""
                />
                <span
                  className="grow"
                  style={{ borderBottom: "1px dotted var(--gold)", translate: "0 -4px", opacity: 0.45 }}
                />
                <span
                  className="shrink-0 text-2xl italic"
                  style={{ fontFamily: "var(--font-serif2)", color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}
                >
                  &mdash;
                </span>
              </div>
              <ServiceText
                fieldKey={`service_${n}_description`}
                content={content}
                className="site-body mt-1 text-sm leading-relaxed"
                style={{ color: "color-mix(in srgb, var(--cream) 70%, transparent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArborServices({ section, content }: ServicesPass) {
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--moss)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${siteHeadingClass(useSiteStyle())} text-4xl font-light leading-[1]`}
            fallback=""
          />
        </div>
        <div className="grid gap-8 @3xl:grid-cols-3">
          {serviceRows(section).map((n) => (
            <div key={n} className="site-sig-specimen flex flex-col gap-3 p-5 text-start">
              <div
                className="flex items-baseline justify-between text-[9px] uppercase"
                style={{ color: "var(--clay)", letterSpacing: "0.15em" }}
              >
                <span>&numero;</span>
                <span>{String(n).padStart(2, "0")}</span>
              </div>
              <F
                fieldKey={`service_${n}_title`}
                content={content}
                as="h3"
                className="min-w-0 italic"
                fallback=""
              />
              <F
                fieldKey={`service_${n}_description`}
                content={content}
                as="p"
                className="site-body text-sm leading-relaxed"
                fallback=""
              />
              <span className="site-sig-care-tag mt-auto inline-block w-max">{String(n).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClearviewServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} text-3xl font-extrabold tracking-tight @5xl:text-4xl`}
            fallback=""
          />
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2 @5xl:grid-cols-4">
          {serviceRows(section).map((n) => (
            <div
              key={n}
              className="hover:-translate-y-1.5 border p-6 shadow-[0_10px_30px_-14px_rgba(8,145,178,0.12)] transition-all duration-300 hover:shadow-[0_20px_45px_-18px_rgba(8,145,178,0.28)]"
              style={{ backgroundColor: "var(--clinic-card)", borderColor: "var(--clinic-border)" }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold transition-colors duration-300 group-hover:bg-[var(--clinic-teal)] group-hover:text-white"
                style={{ backgroundColor: "rgba(8, 145, 178, 0.1)", color: "var(--clinic-teal)" }}
              >
                {String(n).padStart(2, "0")}
              </div>
              <F
                fieldKey={`service_${n}_title`}
                content={content}
                as="h3"
                className={`${headingClass} mb-1 text-lg font-bold tracking-tight`}
                fallback=""
              />
              <ServiceText
                fieldKey={`service_${n}_description`}
                content={content}
                className="site-body text-sm leading-relaxed"
                style={{ color: "var(--clinic-muted)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--navy)" }}>
      <div className="mx-auto max-w-[820px] px-4">
        <div className="site-sig-ledger p-8 md:p-10">
          <div className="site-sig-ledger-rule mb-8" />
          <div className="mb-8 flex flex-col gap-2 text-start">
            <span
              className="text-[0.7rem] uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.22em" }}
            >
              <F fieldKey="nav_services" content={content} fallback="" />
            </span>
            <F
              fieldKey="services_title"
              content={content}
              as="h2"
              className={`${headingClass} text-4xl font-light leading-[1]`}
              fallback=""
            />
          </div>
          <div className="flex flex-col">
            {serviceRows(section).map((n) => (
              <div
                key={n}
                className="grid gap-1 py-4 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] @3xl:items-baseline @3xl:gap-6"
                style={{ borderBottom: "1px dotted var(--line)" }}
              >
                <F
                  fieldKey={`service_${n}_title`}
                  content={content}
                  as="h3"
                  className={`${headingClass} text-xl font-medium`}
                  fallback=""
                />
                <ServiceText
                  fieldKey={`service_${n}_description`}
                  content={content}
                  className="site-body max-w-md text-[0.72rem] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "color-mix(in srgb, var(--navy) 55%, transparent)",
                  }}
                />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: "4.2rem",
                    textAlign: "end",
                  }}
                >
                  &mdash;
                </span>
              </div>
            ))}
          </div>
          <div className="site-sig-ledger-rule-thick mt-8" />
        </div>
      </div>
    </section>
  );
}

function IroncladServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--iron-surface)", color: "var(--iron-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span
            className="flex items-center gap-3 text-xs font-semibold uppercase"
            style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}
          >
            <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-3xl text-4xl font-extrabold uppercase leading-[0.95]`}
            fallback=""
          />
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2 @5xl:grid-cols-4">
          {serviceRows(section).map((n) => (
            <div
              key={n}
              className="border p-8 transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--iron-black)",
                borderColor: "var(--iron-border)",
                borderInlineStartWidth: 3,
                borderInlineStartColor: "var(--iron-amber)",
              }}
            >
              <div className="mb-4 text-xl font-bold" style={{ color: "var(--iron-amber)" }}>
                {String(n).padStart(2, "0")}
              </div>
              <F
                fieldKey={`service_${n}_title`}
                content={content}
                as="h3"
                className={`${headingClass} text-xl font-extrabold uppercase tracking-tight`}
                fallback=""
              />
              <ServiceText
                fieldKey={`service_${n}_description`}
                content={content}
                className="site-body mt-2 text-sm leading-relaxed"
                style={{ color: "var(--iron-muted)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaraServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--bone)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--red)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-3xl text-4xl font-light leading-[0.96]`}
            fallback=""
          />
        </div>
        <div className="grid gap-6 @4xl:grid-cols-2">
          {serviceRows(section).map((n, i) => (
            <div
              key={n}
              className={`site-sig-regs border p-8 @4xl:py-12 ${i === 0 ? "@4xl:col-span-2" : ""}`}
              style={{ borderColor: "var(--line)" }}
            >
              <div className="mb-6 flex items-baseline justify-between">
                <span className="site-sig-plate" style={{ color: "var(--red)" }}>
                  &numero;&nbsp;{String(n).padStart(2, "0")}
                </span>
              </div>
              <F
                fieldKey={`service_${n}_title`}
                content={content}
                as="h3"
                className={`${headingClass} text-2xl font-semibold tracking-tight`}
                fallback=""
              />
              <ServiceText
                fieldKey={`service_${n}_description`}
                content={content}
                className="site-body mt-2 max-w-xl text-sm leading-relaxed"
                style={{ color: "var(--ash)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtelierServices({ section, content }: ServicesPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  const spans = ["@4xl:col-span-7", "@4xl:col-span-5", "@4xl:col-span-8 @4xl:col-start-5"];
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--warm-bg)", color: "var(--warm-text)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3 text-start">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}
          >
            <F fieldKey="nav_services" content={content} fallback="" />
          </span>
          <F
            fieldKey="services_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-2xl text-4xl font-medium leading-[1.05] @5xl:text-5xl`}
            fallback=""
          />
        </div>
        <div className="grid gap-x-12 gap-y-14 @4xl:grid-cols-12">
          {serviceRows(section).map((n, i) => (
            <div key={n} className={spans[i % spans.length]}>
              <div className="flex items-baseline justify-between border-t pt-6" style={{ borderColor: "var(--warm-border)" }}>
                <span
                  className="text-lg italic"
                  style={{ fontFamily: "var(--font-serif2)", color: "var(--warm-accent)" }}
                >
                  {String(n).padStart(2, "0")}
                </span>
              </div>
              <F
                fieldKey={`service_${n}_title`}
                content={content}
                as="h3"
                className={`${headingClass} mt-4 text-2xl font-medium leading-tight`}
                fallback=""
              />
              <ServiceText
                fieldKey={`service_${n}_description`}
                content={content}
                className="site-body mt-2 text-sm leading-relaxed"
                style={{ color: "var(--warm-muted)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({ section, content }: ServicesPass) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { brandColor } = useSiteBrand();
  const svcCount = section.svcCount ?? 0;
  const { theme } = style;
  const headingClass = siteHeadingClass(style);
  const isBold = theme.key === "bold";
  const isCreative = theme.key === "creative";

  if (sig === "redline") return <RedlineServices section={section} content={content} />;
  if (sig === "volatile") return <VolatileServices section={section} content={content} />;
  if (sig === "ember") return <EmberServices section={section} content={content} />;
  if (sig === "meridian") return <MeridianServices section={section} content={content} />;
  if (sig === "arbor") return <ArborServices section={section} content={content} />;
  if (sig === "clearview") return <ClearviewServices section={section} content={content} />;
  if (sig === "harlan") return <HarlanServices section={section} content={content} />;
  if (sig === "ironclad") return <IroncladServices section={section} content={content} />;
  if (sig === "mara") return <MaraServices section={section} content={content} />;
  if (sig === "atelier") return <AtelierServices section={section} content={content} />;

  return (
    <section id="services" className={`py-20 ${theme.surface === "deep" ? "bg-background" : theme.key === "bold" ? "bg-background" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead
          fieldKey="services_title"
          content={content}
          align={isBold || isCreative ? "start" : "centered"}
        />
        {isCreative ? (
          <div className="grid gap-6 @3xl:grid-cols-2">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <SiteCard key={n} subStyle="feature" className="p-0 overflow-hidden">
                <div className="border-t-[3px] p-6" style={{ borderColor: brandColor }}>
                  <span className={`${headingClass} mb-3 inline-block text-3xl font-bold tracking-tight text-muted-foreground/30`}>
                    {String(n).padStart(2, "0")}
                  </span>
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} mb-2 text-xl font-bold tracking-tight`}
                  />
                  <F
                    fieldKey={`service_${n}_description`}
                    content={content}
                    as="p"
                    className="site-body text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              </SiteCard>
            ))}
          </div>
        ) : isBold ? (
          <div className="grid gap-6 @3xl:grid-cols-2">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <div key={n} className="border-s-4 bg-card ps-6" style={{ borderInlineStartColor: brandColor }}>
                <div className="p-6 ps-0">
                  <span className={`${headingClass} mb-2 block text-3xl font-bold tracking-tight text-muted-foreground/30`}>
                    {String(n).padStart(2, "0")}
                  </span>
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} mb-2 text-xl font-bold tracking-tight`}
                  />
                  <F
                    fieldKey={`service_${n}_description`}
                    content={content}
                    as="p"
                    className="site-body text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : theme.key === "corporate" ? (
          <div className="flex flex-col gap-0 divide-y divide-border">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <div key={n} className="flex items-start gap-6 py-6">
                <span className={`${headingClass} mt-1 shrink-0 text-4xl font-bold tracking-tight text-muted-foreground/25`}>
                  {String(n).padStart(2, "0")}
                </span>
                <div>
                  <F
                    fieldKey={`service_${n}_title`}
                    content={content}
                    as="h3"
                    className={`${headingClass} mb-1 text-xl font-bold tracking-tight`}
                  />
                  <F
                    fieldKey={`service_${n}_description`}
                    content={content}
                    as="p"
                    className="site-body text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 @3xl:grid-cols-3">
            {Array.from({ length: svcCount }, (_, i) => i + 1).map((n) => (
              <SiteCard key={n} subStyle="feature">
                <F
                  fieldKey={`service_${n}_title`}
                  content={content}
                  as="h3"
                  className={`${headingClass} mb-2 text-xl font-bold tracking-tight`}
                />
                <F
                  fieldKey={`service_${n}_description`}
                  content={content}
                  as="p"
                  className="site-body text-sm leading-relaxed text-muted-foreground"
                />
              </SiteCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}