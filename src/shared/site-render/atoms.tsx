import type { CSSProperties, ReactNode } from "react";
import { F } from "./internals";
import { useSiteStyle, useSiteBrand, useSiteNav } from "./context";
import { CARD_SHADOW, siteHeadingClass } from "./tokens";
import type { ContentField } from "@/features/sites/types";

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

export function SectionHead({
  fieldKey,
  content,
  eyebrow,
  align = "centered",
  as = "h2",
  eyebrowVariant,
}: {
  fieldKey: string;
  content: Record<string, ContentField>;
  eyebrow?: string;
  align?: "centered" | "start";
  as?: "h2" | "h3";
  eyebrowVariant?: "pill" | "bar" | "text";
}) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const headingClass = siteHeadingClass(style);
  const fill = style.theme.accentRole === "fill";

  let accent: ReactNode;
  if (eyebrowVariant === "text") {
    accent = (
      <span
        className="text-xs font-medium uppercase tracking-[0.18em]"
        style={{ color: brand.brandColor }}
      >
        {eyebrow}
      </span>
    );
  } else if (eyebrowVariant === "bar" || (!fill && eyebrowVariant !== "pill")) {
    accent = (
      <div className="h-1 w-14 rounded-full" style={{ backgroundColor: brand.brandColor }} />
    );
  } else {
    accent = (
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
      >
        {eyebrow}
      </span>
    );
  }

  if (align === "start") {
    return (
      <div className="mb-10 flex flex-col items-start gap-3 text-start">
        {accent}
        <F
          fieldKey={fieldKey}
          content={content}
          as={as}
          className={`${headingClass} text-3xl font-bold tracking-tight`}
        />
      </div>
    );
  }

  return (
    <div className="mb-10 flex flex-col items-center gap-3 text-center">
      {accent}
      <F
        fieldKey={fieldKey}
        content={content}
        as={as}
        className={`${headingClass} text-3xl font-bold tracking-tight`}
      />
    </div>
  );
}

export function SiteCard({
  subStyle = "feature",
  children,
  className = "",
}: {
  subStyle?: "feature" | "testimonial" | "project" | "stat" | "plan";
  children: ReactNode;
  className?: string;
}) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const { radius } = style;
  const edge = style.theme.accentRole === "edge";

  const padding =
    subStyle === "stat"
      ? "p-4"
      : subStyle === "testimonial"
        ? "p-7"
        : subStyle === "plan"
          ? "p-6 text-center"
          : "p-6";

  let baseClasses = "bg-card text-foreground transition-shadow duration-200 hover:shadow-lg ";
  if (radius === "soft") {
    baseClasses += "rounded-2xl ";
  } else {
    baseClasses += "rounded ";
  }

  if (edge) {
    return (
      <div
        className={`${baseClasses} shadow-sm ${padding} ${className}`}
        style={{ borderTop: `3px solid ${brand.brandColor}` }}
      >
        {children}
      </div>
    );
  }

  baseClasses += CARD_SHADOW[radius];
  return <div className={`${baseClasses} ${padding} ${className}`}>{children}</div>;
}

export function StatBlock({
  value,
  label,
  align = "center",
}: {
  value: ReactNode;
  label: ReactNode;
  align?: "center" | "start";
}) {
  const headingClass = siteHeadingClass(useSiteStyle());
  const layout =
    align === "start"
      ? "flex flex-col items-start gap-1 text-start"
      : "flex flex-col items-center gap-1 text-center";
  return (
    <div className={layout}>
      <span className={`${headingClass} text-4xl font-bold tracking-tight`}>{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function CtaBand({
  headlineKey,
  buttonLabelKey,
  content,
}: {
  headlineKey: string;
  buttonLabelKey: string;
  content: Record<string, ContentField>;
}) {
  const brand = useSiteBrand();
  const style = useSiteStyle();
  const theme = style.theme;
  const headingClass = siteHeadingClass(style);
  const sig = getSigName(style.design?.signature);
  const { pages, pageBaseHref, onNavigatePage } = useSiteNav();
  const contact = pages.find((p) => p.id === "contact");
  const href = contact
    ? contact.slug
      ? `${pageBaseHref}/${contact.slug}`
      : pageBaseHref || "/"
    : "#contact";

  const onClick = onNavigatePage
    ? (e: { preventDefault(): void }) => {
        e.preventDefault();
        onNavigatePage("contact");
      }
    : undefined;

  const fill = theme.accentRole === "fill";

  const headline = (className = "") => (
    <F
      fieldKey={headlineKey}
      content={content}
      as="h2"
      className={`${headingClass} max-w-2xl text-3xl font-bold tracking-tight ${className}`}
      fallback=""
    />
  );

  const renderButton = (className = "", btnStyle?: CSSProperties) => (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-8 py-3 text-sm font-semibold transition-colors ${className}`}
      style={btnStyle}
    >
      <F fieldKey={buttonLabelKey} content={content} fallback="" />
    </a>
  );

  if (sig === "redline") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--signal)", color: "#fff" }}
        >
          {headline("text-white")}
          {renderButton(
            "border-2 border-white font-bold uppercase text-white hover:bg-white hover:text-[var(--signal)]",
            { fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }
          )}
        </div>
      </section>
    );
  }

  if (sig === "volatile") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--vol-surface)", color: "var(--vol-text)" }}
        >
          {headline()}
          {renderButton("rounded-full font-semibold", {
            backgroundColor: "var(--vol-accent)",
            color: "var(--vol-bg)",
            fontFamily: "var(--font-body)",
          })}
        </div>
      </section>
    );
  }

  if (sig === "ember") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--coal)", color: "var(--crema)" }}
        >
          <div className="site-sig-char font-bold">{headline("text-3xl font-bold")}</div>
          {renderButton("font-semibold uppercase", {
            backgroundColor: "var(--flame)",
            color: "var(--soot)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          })}
        </div>
      </section>
    );
  }

  if (sig === "meridian") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
        >
          <div className="site-sig-gold-line-wide" />
          {headline("font-light")}
          {renderButton("uppercase font-light", {
            border: `1px solid var(--gold)`,
            color: "var(--gold)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.3em",
          })}
        </div>
      </section>
    );
  }

  if (sig === "arbor") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--clay)", color: "var(--ivory)" }}
        >
          {headline("text-ivory")}
          {renderButton("font-semibold uppercase", {
            backgroundColor: "var(--ivory)",
            color: "var(--ink)",
            letterSpacing: "0.1em",
          })}
        </div>
      </section>
    );
  }

  if (sig === "clearview") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-xl px-6 py-16 text-center"
          style={{ backgroundColor: "var(--clinic-teal)", color: "#fff" }}
        >
          {headline("text-white")}
          {renderButton("rounded-xl font-semibold", {
            backgroundColor: "#fff",
            color: "var(--clinic-teal)",
          })}
        </div>
      </section>
    );
  }

  if (sig === "harlan") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--navy)", color: "var(--paper)" }}
        >
          <div className="site-sig-ledger-rule-thick w-24" />
          {headline("font-light")}
          {renderButton("site-sig-stamp px-8 py-3 font-normal hover:text-[var(--brass)]", {
            backgroundColor: "var(--paper)",
            color: "var(--navy)",
            borderColor: "var(--paper)",
            fontFamily: "var(--font-mono)",
          })}
        </div>
      </section>
    );
  }

  if (sig === "ironclad") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--iron-amber)", color: "var(--iron-black)" }}
        >
          {headline("text-[var(--iron-black)] uppercase font-extrabold")}
          {renderButton("font-bold uppercase", {
            backgroundColor: "var(--iron-black)",
            color: "var(--iron-amber)",
            letterSpacing: "0.1em",
          })}
        </div>
      </section>
    );
  }

  if (sig === "mara") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--ink)", color: "var(--bone)" }}
        >
          {headline("text-[var(--bone)]")}
          {renderButton("border font-normal uppercase hover:bg-[var(--bone)] hover:text-[var(--ink)]", {
            borderColor: "var(--bone)",
            color: "var(--bone)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          })}
        </div>
      </section>
    );
  }

  if (sig === "atelier") {
    return (
      <section className="px-4 py-20">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center"
          style={{ backgroundColor: "var(--warm-text)", color: "var(--warm-bg)" }}
        >
          {headline("text-[var(--warm-bg)]")}
          {renderButton("font-semibold uppercase", {
            backgroundColor: "var(--warm-accent)",
            color: "var(--warm-text)",
            letterSpacing: "0.15em",
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-20">
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center ${
          fill ? "" : "border border-foreground/20 bg-card"
        }`}
        style={
          fill ? { backgroundColor: brand.brandColor, color: brand.textOnBrand } : undefined
        }
      >
        {headline("")}
        {renderButton(
          "",
          fill
            ? { backgroundColor: "#ffffff33", border: "2px solid currentColor", color: "inherit" }
            : { border: `2px solid ${brand.brandColor}`, color: "var(--foreground)" }
        )}
      </div>
    </section>
  );
}
