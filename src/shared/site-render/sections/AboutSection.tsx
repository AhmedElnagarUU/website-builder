import { F } from "../internals";
import { useSiteStyle } from "../context";
import { siteHeadingClass } from "../tokens";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

type AboutPass = Pick<SectionRenderProps, "content" | "businessInfo">;

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

function AboutBody({ content, className = "", style }: { content: SectionRenderProps["content"]; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={`site-body leading-relaxed ${className}`} style={style}>
      <F fieldKey="about_body" content={content} fallback="" />
    </p>
  );
}

function RedlineAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center">
        <span
          className="flex items-center gap-3 text-xs uppercase"
          style={{ color: "var(--signal)", fontFamily: "var(--font-mono)", letterSpacing: "0.25em" }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
          <F fieldKey="nav_about" content={content} fallback="" />
        </span>
        <F
          fieldKey="about_title"
          content={content}
          as="h2"
          className={`${headingClass} text-4xl font-bold uppercase tracking-tight @5xl:text-5xl`}
          fallback=""
        />
        <AboutBody content={content} className="max-w-2xl" style={{ color: "color-mix(in srgb, var(--paper) 75%, transparent)" }} />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-2 border px-4 py-2 text-xs uppercase"
              style={{
                borderColor: "color-mix(in srgb, var(--signal) 30%, transparent)",
                color: "var(--paper)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.15em",
              }}
            >
              <span style={{ color: "var(--signal)" }}>{String(n).padStart(2, "0")}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function VolatileAbout({ content, businessInfo }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="relative overflow-hidden py-24" style={{ backgroundColor: "var(--vol-surface)", color: "var(--vol-text)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-5 @5xl:gap-16">
        <div className="flex flex-col items-start gap-4 @5xl:col-span-3">
          <span
            className="text-xs font-semibold uppercase"
            style={{ color: "var(--vol-accent)", letterSpacing: "0.18em" }}
          >
            <F fieldKey="nav_about" content={content} fallback="" />
          </span>
          <F
            fieldKey="about_title"
            content={content}
            as="h2"
            className={`${headingClass} text-4xl font-bold tracking-[-0.02em] @5xl:text-5xl`}
            fallback=""
          />
          <AboutBody content={content} className="max-w-lg" style={{ color: "var(--vol-muted)" }} />
        </div>
        <div className="relative @5xl:col-span-2">
          <div
            className="border p-8 text-start"
            style={{ borderColor: "var(--vol-border)", backgroundColor: "var(--vol-surface-light)" }}
          >
            <div className="mb-2 text-4xl font-bold" style={{ color: "var(--vol-accent)" }}>
              &mdash;
            </div>
            <p className="text-sm uppercase" style={{ color: "var(--vol-muted)", letterSpacing: "0.14em" }}>
              {businessInfo.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmberAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--soot)", color: "var(--crema)" }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
        <div className="flex items-center justify-center gap-6">
          <span
            className="inline-block w-px"
            style={{ height: 90, background: "linear-gradient(to bottom, transparent, var(--embers) 50%, transparent)" }}
          />
          <span className="text-sm" style={{ color: "var(--flame)" }}>
            &loz;
          </span>
          <span
            className="inline-block w-px"
            style={{ height: 90, background: "linear-gradient(to bottom, transparent, var(--embers) 50%, transparent)" }}
          />
        </div>
        <span
          className="text-xs uppercase"
          style={{ color: "var(--flame)", fontFamily: "var(--font-mono)", letterSpacing: "0.24em" }}
        >
          <F fieldKey="nav_about" content={content} fallback="" />
        </span>
        <F
          fieldKey="about_title"
          content={content}
          as="h2"
          className={`${headingClass} text-4xl font-medium leading-[1]`}
          fallback=""
        />
        <AboutBody
          content={content}
          className="max-w-xl leading-loose"
          style={{ color: "color-mix(in srgb, var(--crema) 70%, transparent)" }}
        />
      </div>
    </section>
  );
}

function MeridianAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-2 @5xl:gap-16">
        <div className="flex flex-col items-start gap-4">
          <div className="site-sig-gold-line" />
          <F
            fieldKey="about_title"
            content={content}
            as="h2"
            className={`${headingClass} text-4xl font-light tracking-[0.02em]`}
            fallback=""
          />
          <AboutBody
            content={content}
            className="max-w-md leading-loose"
            style={{ color: "color-mix(in srgb, var(--cream) 75%, transparent)" }}
          />
        </div>
        <div className="hidden @5xl:block" aria-hidden="true">
          <div className="site-sig-gold-line-wide mb-8 opacity-60" />
          <p
            className="text-2xl font-light italic leading-relaxed"
            style={{ fontFamily: "var(--font-serif2)", color: "color-mix(in srgb, var(--cream) 55%, transparent)" }}
          >
            &ldquo;&nbsp;&mdash;&nbsp;&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function ArborAbout({ content, businessInfo }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--ivory)", color: "var(--ink)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-2 @5xl:gap-16">
        <div className="flex flex-col items-start gap-5">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--moss)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            <F fieldKey="nav_about" content={content} fallback="" />
          </span>
          <F
            fieldKey="about_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-lg text-4xl font-light leading-[1]`}
            fallback=""
          />
          <AboutBody content={content} className="max-w-lg" style={{ color: "var(--moss)" }} />
        </div>
        <div className="site-sig-specimen flex flex-col gap-2 p-5 text-start text-xs leading-relaxed">
          <span
            className="text-[9px] uppercase"
            style={{ color: "var(--clay)", letterSpacing: "0.15em", fontFamily: "var(--font-mono)" }}
          >
            <F fieldKey="nav_about" content={content} fallback="" />
          </span>
          <span>{businessInfo.location}</span>
        </div>
      </div>
    </section>
  );
}

function ClearviewAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--clinic-bg)", color: "var(--clinic-text)" }}>
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 @5xl:grid-cols-2 @5xl:gap-16">
        <div className="flex flex-col items-start gap-4">
          <F
            fieldKey="about_title"
            content={content}
            as="h2"
            className={`${headingClass} text-3xl font-extrabold tracking-tight @5xl:text-4xl`}
            fallback=""
          />
          <AboutBody
            content={content}
            className="max-w-lg leading-relaxed"
            style={{ color: "var(--clinic-muted)" }}
          />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex items-center gap-4 rounded-xl border p-5"
              style={{ backgroundColor: "var(--clinic-card)", borderColor: "var(--clinic-border)" }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                style={{ backgroundColor: "rgba(8, 145, 178, 0.1)", color: "var(--clinic-teal)" }}
              >
                {String(n).padStart(2, "0")}
              </span>
              <span
                className="h-px grow"
                style={{ background: "linear-gradient(to right, var(--clinic-border), transparent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HarlanAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--navy)", color: "var(--paper)" }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center">
        <span
          className="text-[0.7rem] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--brass)", letterSpacing: "0.24em" }}
        >
          <F fieldKey="nav_about" content={content} fallback="" />
        </span>
        <F
          fieldKey="about_title"
          content={content}
          as="h2"
          className={`${headingClass} text-4xl font-light leading-[1.05]`}
          fallback=""
        />
        <AboutBody
          content={content}
          className="max-w-2xl text-xl italic leading-relaxed"
          style={{ color: "color-mix(in srgb, var(--paper) 80%, transparent)" }}
        />
        <div className="site-sig-ledger-rule-thick mt-4 w-24 opacity-70" />
      </div>
    </section>
  );
}

function IroncladAbout({ content, businessInfo }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="relative py-24" style={{ backgroundColor: "var(--iron-black)", color: "var(--iron-text)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-5 @5xl:gap-16">
        <div className="flex flex-col items-start gap-4 @5xl:col-span-3">
          <span
            className="flex items-center gap-3 text-xs font-semibold uppercase"
            style={{ color: "var(--iron-amber)", letterSpacing: "0.2em" }}
          >
            <span className="inline-block h-[3px] w-8" style={{ backgroundColor: "var(--iron-amber)" }} />
            <F fieldKey="nav_about" content={content} fallback="" />
          </span>
          <F
            fieldKey="about_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-xl text-4xl font-extrabold uppercase leading-[0.95]`}
            fallback=""
          />
          <AboutBody content={content} className="max-w-lg" style={{ color: "var(--iron-muted)" }} />
        </div>
        <div className="relative pb-8 @5xl:col-span-2">
          <div
            className="border p-8"
            style={{ borderColor: "var(--iron-border)", backgroundColor: "var(--iron-surface)" }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--iron-amber)" }}>
              {businessInfo.location}
            </p>
          </div>
          <div
            className="mt-4 inline-block border-2 px-4 py-2 text-xs font-bold uppercase"
            style={{ borderColor: "var(--iron-amber)", color: "var(--iron-amber)" }}
          >
            {String(1).padStart(2, "0")}
          </div>
        </div>
      </div>
    </section>
  );
}

function MaraAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--ink)", color: "var(--bone)" }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center">
        <span
          className="text-xs uppercase"
          style={{ color: "var(--red)", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
        >
          <F fieldKey="nav_about" content={content} fallback="" />
        </span>
        <F
          fieldKey="about_title"
          content={content}
          as="h2"
          className={`${headingClass} max-w-2xl text-4xl font-light leading-[0.96]`}
          fallback=""
        />
        <AboutBody
          content={content}
          className="max-w-2xl"
          style={{ color: "color-mix(in srgb, var(--bone) 75%, transparent)" }}
        />
        <div className="site-sig-plate mt-4" style={{ color: "color-mix(in srgb, var(--bone) 40%, transparent)" }}>
          {String(1).padStart(2, "0")}&nbsp;/&nbsp;{String(1).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}

function AtelierAbout({ content }: AboutPass) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--warm-surface)", color: "var(--warm-text)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 @5xl:grid-cols-12 @5xl:gap-16">
        <div className="flex flex-col items-start gap-4 @5xl:col-span-5">
          <span
            className="text-xs uppercase"
            style={{ color: "var(--warm-accent)", letterSpacing: "0.3em" }}
          >
            <F fieldKey="nav_about" content={content} fallback="" />
          </span>
          <F
            fieldKey="about_title"
            content={content}
            as="h2"
            className={`${headingClass} max-w-md text-4xl font-medium italic leading-[1.05] @5xl:text-5xl`}
            fallback=""
          />
        </div>
        <div className="@5xl:col-span-7">
          <AboutBody content={content} className="max-w-2xl text-lg" style={{ color: "var(--warm-muted)" }} />
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ content, businessInfo }: AboutPass) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { theme } = style;

  if (sig === "redline") return <RedlineAbout content={content} businessInfo={businessInfo} />;
  if (sig === "volatile") return <VolatileAbout content={content} businessInfo={businessInfo} />;
  if (sig === "ember") return <EmberAbout content={content} businessInfo={businessInfo} />;
  if (sig === "meridian") return <MeridianAbout content={content} businessInfo={businessInfo} />;
  if (sig === "arbor") return <ArborAbout content={content} businessInfo={businessInfo} />;
  if (sig === "clearview") return <ClearviewAbout content={content} businessInfo={businessInfo} />;
  if (sig === "harlan") return <HarlanAbout content={content} businessInfo={businessInfo} />;
  if (sig === "ironclad") return <IroncladAbout content={content} businessInfo={businessInfo} />;
  if (sig === "mara") return <MaraAbout content={content} businessInfo={businessInfo} />;
  if (sig === "atelier") return <AtelierAbout content={content} businessInfo={businessInfo} />;

  if (theme.key === "bold") {
    return (
      <section id="about" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-12 @5xl:grid-cols-5">
            <div className="@5xl:col-span-2">
              <SectionHead fieldKey="about_title" content={content} align="start" />
            </div>
            <div className="@5xl:col-span-3 flex flex-col justify-center gap-6">
              <AboutBody content={content} className="text-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (theme.key === "creative") {
    return (
      <section id="about" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-12 @5xl:grid-cols-2">
            <div>
              <SectionHead fieldKey="about_title" content={content} align="start" />
            </div>
            <div className="flex flex-col justify-center gap-6">
              <AboutBody content={content} className="text-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <SectionHead fieldKey="about_title" content={content} align="centered" />
        <AboutBody content={content} className="mx-auto max-w-2xl text-lg" />
      </div>
    </section>
  );
}