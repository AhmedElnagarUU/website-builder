import { F, SampleTag } from "../internals";
import { useSiteStyle } from "../context";
import { SectionHead, SiteCard } from "../atoms";
import { useTranslations } from "next-intl";
import type { SectionRenderProps } from "./types";

type TestimonialPair = { key: string; author: string };
type SignatureProps = {
  content: SectionRenderProps["content"];
  pairs: TestimonialPair[];
  eyebrow: string;
};

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

function RedlineTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3">
          <span
            className="flex items-center gap-3 text-xs uppercase"
            style={{ color: "var(--signal)", fontFamily: "var(--font-mono)", letterSpacing: "0.25em" }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
            {eyebrow}
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure
                className="p-8"
                style={{
                  backgroundColor: "var(--ticket)",
                  border: "1.5px solid var(--ink)",
                  boxShadow: "6px 6px 0 0 var(--ink)",
                }}
              >
                <div className="mb-4 text-5xl leading-none font-bold" style={{ color: "var(--signal)" }} aria-hidden="true">
                  &ldquo;
                </div>
                <blockquote className="site-body leading-relaxed" style={{ color: "var(--ink)" }}>
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption
                  className="mt-6 flex items-center gap-3 text-sm uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", letterSpacing: "0.15em" }}
                >
                  <span className="inline-block h-2 w-2" style={{ backgroundColor: "var(--signal)" }} />
                  <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  const q = pairs[0];
  if (!q) return null;
  return (
    <section id="testimonials" className="relative overflow-hidden py-24" style={{ backgroundColor: "var(--vol-surface)", color: "var(--vol-text)" }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
        <SectionsEyebrow accent="var(--vol-accent)">{eyebrow}</SectionsEyebrow>
        <SampleTag>
          <figure className="flex flex-col items-center gap-6">
            <span className="text-6xl leading-none" style={{ color: "var(--vol-accent)", opacity: 0.8 }} aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className="site-body text-xl leading-relaxed" style={{ color: "var(--vol-muted)" }}>
              <F fieldKey={q.key} content={content} as="p" />
            </blockquote>
            <figcaption
              className="flex items-center gap-3 text-sm uppercase"
              style={{ color: "var(--vol-text)", letterSpacing: "0.16em" }}
            >
              <span className="inline-block h-px w-8" style={{ backgroundColor: "var(--vol-accent)" }} />
              <F fieldKey={q.author} content={content} />
              <span className="inline-block h-px w-8" style={{ backgroundColor: "var(--vol-accent)" }} />
            </figcaption>
          </figure>
        </SampleTag>
      </div>
    </section>
  );
}

function EmberTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--coal)", color: "var(--crema)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionsEyebrow accent="var(--flame)">{eyebrow}</SectionsEyebrow>
          <span className="text-sm" style={{ color: "var(--flame)" }} aria-hidden="true">
            &loz;
          </span>
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure
                className="flex flex-col items-start gap-4 p-7"
                style={{ border: "1px solid color-mix(in srgb, var(--line) 40%, transparent)" }}
              >
                <span style={{ color: "var(--flame)" }} aria-hidden="true">
                  ◆
                </span>
                <blockquote
                  className="site-body leading-relaxed"
                  style={{ color: "color-mix(in srgb, var(--crema) 85%, transparent)" }}
                >
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="site-body text-sm" style={{ color: "var(--flame)" }}>
                  <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeridianTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--cream-light)", color: "var(--navy)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-4 text-sm" style={{ color: "var(--gold)", letterSpacing: "0.3em" }} aria-hidden="true">
            ★★★★★
          </span>
          <h2
            className="text-3xl font-light tracking-[0.02em]"
            style={{ fontFamily: "var(--font-serif2)", color: "var(--navy)" }}
          >
            {eyebrow}
          </h2>
          <div className="site-sig-gold-line" style={{ width: 72 }} />
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure
                className="p-7"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid color-mix(in srgb, var(--gold) 30%, transparent)",
                  boxShadow: "0 14px 40px -24px rgba(23, 37, 84, 0.5)",
                }}
              >
                <div
                  className="mb-4 text-5xl leading-none"
                  style={{ fontFamily: "var(--font-serif2)", color: "var(--gold)" }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <blockquote className="site-body leading-relaxed" style={{ color: "color-mix(in srgb, var(--navy) 80%, transparent)" }}>
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-sm italic" style={{ fontFamily: "var(--font-serif2)", color: "var(--navy)" }}>
                  <span className="inline-block h-px w-6" style={{ backgroundColor: "var(--gold)" }} />
                  <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArborTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3">
          <SectionsEyebrow accent="var(--moss)">{eyebrow}</SectionsEyebrow>
          <span className="inline-block" style={{ width: 44, height: 1, backgroundColor: "var(--clay)" }} />
        </div>
        <div className="flex flex-col">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure className="border-b py-7" style={{ borderColor: "var(--line)" }}>
                <blockquote className="site-body text-lg leading-relaxed" style={{ fontFamily: "var(--font-serif2)", color: "var(--ink)" }}>
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="mt-3 text-xs uppercase" style={{ color: "var(--moss)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                  &mdash; <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClearviewTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3">
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--clinic-text)" }}>
            {eyebrow}
          </h2>
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure
                className="flex gap-5 rounded-[12px] p-7"
                style={{
                  background: "linear-gradient(180deg, #ffffff, #F8FAFC)",
                  border: "1px solid var(--clinic-border)",
                }}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "rgba(8, 145, 178, 0.1)", color: "var(--clinic-teal)", fontFamily: "var(--font-serif2)" }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <div className="flex flex-col gap-3">
                  <blockquote className="site-body leading-relaxed" style={{ color: "var(--clinic-muted)" }}>
                    <F fieldKey={q.key} content={content} as="p" />
                  </blockquote>
                  <figcaption className="site-body text-sm font-semibold" style={{ color: "var(--clinic-teal)" }}>
                    <F fieldKey={q.author} content={content} />
                  </figcaption>
                </div>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  const q = pairs[0];
  if (!q) return null;
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--paper)" }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
        <SectionsEyebrow accent="var(--brass)">{eyebrow}</SectionsEyebrow>
        <SampleTag>
          <figure className="flex flex-col items-center gap-6">
            <blockquote
              className="text-2xl italic leading-relaxed"
              style={{ fontFamily: "var(--font-serif2)", color: "var(--paper)" }}
            >
              &ldquo; <F fieldKey={q.key} content={content} as="p" /> &rdquo;
            </blockquote>
            <div className="site-sig-ledger-rule-thick w-24 opacity-60" />
            <figcaption
              className="text-xs uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.2em" }}
            >
              <F fieldKey={q.author} content={content} />
            </figcaption>
          </figure>
        </SampleTag>
      </div>
    </section>
  );
}

function IroncladTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--iron-surface)", color: "var(--iron-text)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col items-start gap-3">
          <h2 className="text-3xl font-extrabold uppercase" style={{ color: "var(--iron-amber)", letterSpacing: "0.5ex" }}>
            {eyebrow}
          </h2>
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure
                className="p-7"
                style={{
                  borderInlineStartWidth: 3,
                  borderInlineStartColor: "var(--iron-amber)",
                  backgroundColor: "var(--iron-black)",
                  borderBlock: "1px solid var(--iron-border)",
                }}
              >
                <blockquote className="site-body text-lg font-medium leading-relaxed" style={{ color: "var(--iron-text)" }}>
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="mt-5 text-xs font-bold uppercase" style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}>
                  <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaraTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--ink)", color: "var(--bone)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <SectionsEyebrow accent="var(--red)">{eyebrow}</SectionsEyebrow>
          <div className="w-10" style={{ borderBottom: "1px solid var(--line)" }} />
        </div>
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <figure className="border p-7" style={{ borderColor: "color-mix(in srgb, var(--line) 50%, transparent)" }}>
                <blockquote className="site-body leading-relaxed" style={{ color: "color-mix(in srgb, var(--bone) 80%, transparent)" }}>
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-xs uppercase" style={{ color: "var(--bone)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
                  <span className="inline-block h-2 w-2" style={{ backgroundColor: "var(--red)" }} />
                  <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtelierTestimonials({ content, pairs, eyebrow }: SignatureProps) {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--warm-surface)", color: "var(--warm-text)" }}>
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 flex flex-col items-start gap-3">
          <SectionsEyebrow accent="var(--warm-accent)">{eyebrow}</SectionsEyebrow>
        </div>
        <div className="grid gap-6 @4xl:grid-cols-2">
          {pairs.map((q, i) => (
            <SampleTag key={q.key}>
              <figure
                className={`flex flex-col gap-5 p-8 ${i % 2 === 1 ? "@4xl:translate-y-10" : ""}`}
                style={{
                  border: "1px solid var(--warm-border)",
                  backgroundColor: "var(--warm-bg)",
                  boxShadow: "0 20px 50px -30px rgba(51, 29, 17, 0.45)",
                }}
              >
                <span
                  className="text-5xl leading-none"
                  style={{ fontFamily: "var(--font-playfair-display, var(--font-serif2))", color: "var(--warm-accent)" }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="site-body text-lg italic leading-relaxed" style={{ color: "var(--warm-text)" }}>
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="text-xs uppercase" style={{ color: "var(--warm-muted)", letterSpacing: "0.2em" }}>
                  &mdash; <F fieldKey={q.author} content={content} />
                </figcaption>
              </figure>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionsEyebrow({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <span className="text-xs uppercase" style={{ color: accent, fontFamily: "var(--font-mono)", letterSpacing: "0.24em" }}>
      {children}
    </span>
  );
}

export function TestimonialsSection({ section, content }: SectionRenderProps) {
  const style = useSiteStyle();
  const t = useTranslations("site");
  const sig = getSigName(style.design?.signature);
  const { theme } = style;

  const eyebrow = t("labels.testimonials");
  const pairs: TestimonialPair[] = section.fields
    .filter((f) => f.key.startsWith("testimonial_") && f.key.endsWith("_quote"))
    .map((q) => ({ key: q.key, author: q.key.replace("_quote", "_author") }));

  if (sig === "redline") return <RedlineTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "volatile") return <VolatileTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "ember") return <EmberTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "meridian") return <MeridianTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "arbor") return <ArborTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "clearview") return <ClearviewTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "harlan") return <HarlanTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "ironclad") return <IroncladTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "mara") return <MaraTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;
  if (sig === "atelier") return <AtelierTestimonials content={content} pairs={pairs} eyebrow={eyebrow} />;

  return (
    <section className={`py-20 ${theme.key === "bold" || theme.surface === "deep" ? "bg-muted/30" : ""}`}>
      <div className="mx-auto max-w-5xl px-4">
        <SectionHead
          fieldKey="testimonial_1_quote"
          content={content}
          align={theme.key === "bold" || theme.key === "creative" ? "start" : "centered"}
          eyebrow={eyebrow}
        />
        <div className="grid gap-6 @3xl:grid-cols-2">
          {pairs.map((q) => (
            <SampleTag key={q.key}>
              <SiteCard subStyle="testimonial">
                <div className="mb-4 text-5xl leading-none font-bold opacity-25" aria-hidden="true">
                  &ldquo;
                </div>
                <blockquote className="site-body text-muted-foreground leading-relaxed">
                  <F fieldKey={q.key} content={content} as="p" />
                </blockquote>
                <figcaption className="mt-5 site-body text-sm font-semibold text-foreground">
                  <F fieldKey={q.author} content={content} />
                </figcaption>
              </SiteCard>
            </SampleTag>
          ))}
        </div>
      </div>
    </section>
  );
}