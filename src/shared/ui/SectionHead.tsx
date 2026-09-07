import type { ReactNode } from "react";

/**
 * Vexo section head (source: variant-14 .section-head + .tab + .title).
 * A rotated yellow tape tab (dot + label) atop a Caveat title, sitting on an
 * ink bottom rule. Labels/titles are passed in (localized by the caller).
 */
export function SectionHead({
  tab,
  title,
  size = "default",
  className = "",
}: {
  tab?: ReactNode;
  title: ReactNode;
  size?: "default" | "lg";
  className?: string;
}) {
  const titleClasses =
    size === "lg"
      ? "mono-display text-[clamp(40px,5.6vw,76px)] font-bold leading-[0.98] tracking-tight text-ink"
      : "mono-display text-3xl font-bold leading-none tracking-tight text-ink md:text-5xl";

  return (
    <div
      className={`grid grid-cols-1 items-end gap-4 border-b-2 border-ink pb-4 md:grid-cols-[4fr_8fr] md:gap-8 ${className}`}
    >
      {tab && (
        <span className="mono-display inline-flex w-max -rotate-1 items-center gap-2.5 rounded bg-mono-yellow px-3.5 py-1.5 text-xl font-semibold text-ink shadow-sm">
          <span className="h-3.5 w-3.5 rounded-full bg-mono-red" />
          {tab}
        </span>
      )}
      <h2 className={titleClasses}>{title}</h2>
    </div>
  );
}
