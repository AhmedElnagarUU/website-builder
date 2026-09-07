import type { ReactNode } from "react";
import { F } from "./internals";
import { useSiteStyle, useSiteBrand, useSiteNav } from "./context";
import { CARD_SHADOW, siteHeadingClass } from "./tokens";
import type { ContentField } from "@/features/sites/types";

export function SectionHead({
  fieldKey,
  content,
  eyebrow,
  align = "centered",
  as = "h2",
}: {
  fieldKey: string;
  content: Record<string, ContentField>;
  eyebrow?: string;
  align?: "centered" | "start";
  as?: "h2" | "h3";
}) {
  const style = useSiteStyle();
  const brand = useSiteBrand();
  const headingClass = siteHeadingClass(style);
  const fill = style.theme.accentRole === "fill";

  const accent = fill ? (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
      style={{ backgroundColor: brand.brandColor, color: brand.textOnBrand }}
    >
      {eyebrow}
    </span>
  ) : (
    <div className="h-1 w-14 rounded-full" style={{ backgroundColor: brand.brandColor }} />
  );

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
}: {
  value: ReactNode;
  label: ReactNode;
}) {
  const headingClass = siteHeadingClass(useSiteStyle());
  return (
    <div className="flex flex-col items-center gap-1 text-center">
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
  const theme = useSiteStyle().theme;
  const headingClass = siteHeadingClass(useSiteStyle());
  const { pages, pageBaseHref, onNavigatePage } = useSiteNav();
  const contact = pages.find((p) => p.id === "contact");
  const href = contact
    ? contact.slug
      ? `${pageBaseHref}/${contact.slug}`
      : pageBaseHref || "/"
    : "#contact";

  const fill = theme.accentRole === "fill";

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
        <F
          fieldKey={headlineKey}
          content={content}
          as="h2"
          className={`${headingClass} max-w-2xl text-3xl font-bold tracking-tight`}
        />
        <a
          href={href}
          onClick={
            onNavigatePage
              ? (e) => {
                  e.preventDefault();
                  onNavigatePage("contact");
                }
              : undefined
          }
          className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold transition-colors"
          style={
            fill
              ? { backgroundColor: "#ffffff33", border: "2px solid currentColor", color: "inherit" }
              : { border: `2px solid ${brand.brandColor}`, color: "var(--foreground)" }
          }
        >
          <F fieldKey={buttonLabelKey} content={content} />
        </a>
      </div>
    </section>
  );
}
