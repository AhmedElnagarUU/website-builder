import { F } from "../internals";
import { useSiteStyle } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

type FaqPass = Pick<SectionRenderProps, "section" | "content">;

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

function faqItems(section: SectionRenderProps["section"]) {
  const count = section.faqCount ?? 3;
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { q: `faq_${n}_question`, a: `faq_${n}_answer`, index: String(n).padStart(2, "0") };
  });
}

function Toggle({ style, className = "" }: { style?: React.CSSProperties; className?: string }) {
  return (
    <span
      className={`shrink-0 font-light transition-transform duration-200 group-open:rotate-45 ${className}`}
      style={style}
      aria-hidden="true"
    >
      +
    </span>
  );
}

function Answer({ item, content, className = "", style }: { item: ReturnType<typeof faqItems>[number]; content: SectionRenderProps["content"]; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={className} style={style}>
      <F fieldKey={item.a} content={content} fallback="" />
    </p>
  );
}

function FaqTitle({ content, className = "" }: { content: SectionRenderProps["content"]; className?: string }) {
  return <F fieldKey="faq_title" content={content} as="h2" className={`text-4xl font-bold tracking-tight ${className}`} fallback="" />;
}

function RedlineFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
          <FaqTitle content={content} className={`${headingClass} uppercase`} />
        </div>
        <div className="flex flex-col">
          {faqItems(section).map((item) => (
            <details key={item.q} className="group py-5" style={{ borderTop: "1px solid color-mix(in srgb, var(--ink) 15%, transparent)" }}>
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 py-1 font-bold uppercase tracking-tight`}>
                <span className="shrink-0 text-sm" style={{ color: "var(--signal)", fontFamily: "var(--font-mono)" }}>
                  {item.index}
                </span>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--signal)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 ps-10 leading-relaxed"
                style={{ color: "var(--steel)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmberFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--soot)", color: "var(--crema)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-sm" style={{ color: "var(--flame)" }} aria-hidden="true">
            &loz;
          </span>
          <FaqTitle content={content} className={`${headingClass} font-medium leading-[1]`} />
        </div>
        <div className="border p-6 @3xl:p-8" style={{ backgroundColor: "var(--coal)", borderColor: "color-mix(in srgb, var(--line) 40%, transparent)" }}>
          <div className="flex flex-col">
            {faqItems(section).map((item) => (
              <details key={item.q} className="group py-5" style={{ borderBottom: "1px solid color-mix(in srgb, var(--line) 40%, transparent)" }}>
                <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-xl`}>
                  <span className="min-w-0 flex-1">
                    <F fieldKey={item.q} content={content} as="span" />
                  </span>
                  <Toggle style={{ color: "var(--flame)" }} />
                </summary>
                <Answer
                  item={item}
                  content={content}
                  className="site-body mt-3 leading-relaxed"
                  style={{ color: "color-mix(in srgb, var(--crema) 60%, transparent)" }}
                />
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MeridianFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="site-sig-gold-line-wide" />
          <FaqTitle content={content} className={`${headingClass} font-light tracking-[0.02em]`} />
        </div>
        <div className="flex flex-col">
          {faqItems(section).map((item) => (
            <details key={item.q} className="group py-5" style={{ borderBottom: "1px solid var(--navy-border)" }}>
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-2xl font-light`}>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--gold)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 leading-relaxed"
                style={{ color: "color-mix(in srgb, var(--cream) 70%, transparent)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArborFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <span className="inline-block" style={{ width: 44, height: 1, backgroundColor: "var(--clay)" }} />
          <FaqTitle content={content} className={`${headingClass} font-light leading-[1]`} />
        </div>
        <div className="flex flex-col">
          {faqItems(section).map((item) => (
            <details key={item.q} className="group py-5" style={{ borderTop: "1px solid var(--line)" }}>
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-xl font-light`}>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--moss)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 leading-relaxed"
                style={{ color: "var(--moss)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--vol-bg)", color: "var(--vol-text)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3 text-start">
          <FaqTitle content={content} className={`${headingClass} tracking-[-0.02em]`} />
        </div>
        <div className="border-t" style={{ borderColor: "var(--vol-border)" }}>
          {faqItems(section).map((item) => (
            <details key={item.q} className="group py-6" style={{ borderBottom: "1px solid var(--vol-border)" }}>
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-2xl font-bold tracking-tight`}>
                <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--vol-accent)" }}>
                  {item.index}
                </span>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--vol-accent)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 leading-relaxed"
                style={{ color: "var(--vol-muted)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClearviewFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3 text-start">
          <FaqTitle content={content} className={`${headingClass} text-3xl font-extrabold tracking-tight @5xl:text-4xl`} />
        </div>
        <div className="flex flex-col gap-4">
          {faqItems(section).map((item) => (
            <details key={item.q} className="group rounded-[12px] border p-6" style={{ backgroundColor: "var(--clinic-card)", borderColor: "var(--clinic-border)" }}>
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-lg font-bold tracking-tight`}>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--clinic-teal)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 leading-relaxed"
                style={{ color: "var(--clinic-muted)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--navy)" }}>
      <div className="mx-auto max-w-[820px] px-4">
        <div className="site-sig-ledger p-8 @3xl:p-10">
          <div className="site-sig-ledger-rule mb-8" />
          <FaqTitle content={content} className={`${headingClass} mb-8 font-light leading-[1]`} />
          <div className="flex flex-col">
            {faqItems(section).map((item) => (
              <details key={item.q} className="group py-4" style={{ borderBottom: "1px dotted var(--line)" }}>
                <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-xl font-medium`}>
                  <span className="shrink-0 text-[0.7rem] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.2em" }}>
                    {item.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <F fieldKey={item.q} content={content} as="span" />
                  </span>
                  <Toggle style={{ color: "var(--brass)" }} />
                </summary>
                <Answer
                  item={item}
                  content={content}
                  className="site-body mt-3 leading-relaxed"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "color-mix(in srgb, var(--navy) 70%, transparent)" }}
                />
              </details>
            ))}
          </div>
          <div className="site-sig-ledger-rule-thick mt-8" />
        </div>
      </div>
    </section>
  );
}

function IroncladFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--iron-black)", color: "var(--iron-text)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3">
          <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
          <FaqTitle content={content} className={`${headingClass} max-w-3xl font-extrabold uppercase leading-[0.95]`} />
        </div>
        <div className="flex flex-col gap-4">
          {faqItems(section).map((item) => (
            <details
              key={item.q}
              className="group border p-6"
              style={{ backgroundColor: "var(--iron-surface)", borderColor: "var(--iron-border)", borderInlineStartWidth: 3, borderInlineStartColor: "var(--iron-amber)" }}
            >
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-xl font-bold uppercase tracking-tight`}>
                <span className="shrink-0 text-sm font-bold" style={{ color: "var(--iron-amber)" }}>
                  {item.index}
                </span>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--iron-amber)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 leading-relaxed"
                style={{ color: "var(--iron-muted)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaraFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--bone)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="site-sig-regs border p-8" style={{ borderColor: "var(--line)" }}>
          <div className="mb-6 flex flex-col items-start justify-between gap-4 @3xl:flex-row @3xl:items-baseline">
            <FaqTitle content={content} className={`${headingClass} text-3xl font-light leading-[0.96]`} />
          </div>
          <div className="flex flex-col">
            {faqItems(section).map((item) => (
              <details key={item.q} className="group py-4" style={{ borderBottom: "1px solid var(--line)" }}>
                <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-xl font-semibold tracking-tight`}>
                  <span className="min-w-0 flex-1">
                    <F fieldKey={item.q} content={content} as="span" />
                  </span>
                  <Toggle style={{ color: "var(--red)" }} />
                </summary>
                <Answer
                  item={item}
                  content={content}
                  className="site-body mt-3 leading-relaxed"
                  style={{ color: "var(--ash)" }}
                />
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AtelierFaq({ section, content }: FaqPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--warm-bg)", color: "var(--warm-text)" }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3">
          <span className="text-xs uppercase" style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}>
            &mdash;
          </span>
          <FaqTitle content={content} className={`${headingClass} max-w-2xl font-medium leading-[1.05] @5xl:text-5xl`} />
        </div>
        <div className="flex flex-col">
          {faqItems(section).map((item, i) => (
            <details key={item.q} className="group py-5" style={{ borderTop: "1px solid var(--warm-border)" }}>
              <summary className={`${headingClass} flex cursor-pointer list-none items-center gap-4 text-2xl font-medium leading-tight`}>
                <span className="shrink-0 text-lg italic" style={{ fontFamily: "var(--font-serif2)", color: "var(--warm-accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle style={{ color: "var(--warm-accent)" }} />
              </summary>
              <Answer
                item={item}
                content={content}
                className="site-body mt-3 leading-relaxed"
                style={{ color: "var(--warm-muted)" }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ section, content }: FaqPass) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { theme } = style;
  const headingClass = siteHeadingClass(style);

  if (sig === "redline") return <RedlineFaq section={section} content={content} />;
  if (sig === "volatile") return <VolatileFaq section={section} content={content} />;
  if (sig === "ember") return <EmberFaq section={section} content={content} />;
  if (sig === "meridian") return <MeridianFaq section={section} content={content} />;
  if (sig === "arbor") return <ArborFaq section={section} content={content} />;
  if (sig === "clearview") return <ClearviewFaq section={section} content={content} />;
  if (sig === "harlan") return <HarlanFaq section={section} content={content} />;
  if (sig === "ironclad") return <IroncladFaq section={section} content={content} />;
  if (sig === "mara") return <MaraFaq section={section} content={content} />;
  if (sig === "atelier") return <AtelierFaq section={section} content={content} />;

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHead fieldKey="faq_title" content={content} align={theme.accentRole === "edge" && theme.key === "corporate" ? "start" : "centered"} />
        <div className="divide-y divide-border rounded-xl">
          {faqItems(section).map((item) => (
            <details key={item.q} className="group py-5">
              <summary className={`${headingClass} flex cursor-pointer list-none items-center justify-between gap-4 font-bold tracking-tight`}>
                <span className="min-w-0">
                  <F fieldKey={item.q} content={content} as="span" />
                </span>
                <Toggle className="text-muted-foreground" />
              </summary>
              <Answer item={item} content={content} className="site-body mt-3 leading-relaxed text-muted-foreground" />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}