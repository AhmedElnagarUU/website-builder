import { F } from "../internals";
import { useSiteStyle, useSiteNav } from "../context";
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

const SIG_BG: Record<string, string> = {
  redline: "var(--ink)",
  volatile: "var(--vol-bg)",
  ember: "var(--coal)",
  meridian: "var(--navy)",
  arbor: "var(--ink)",
  clearview: "var(--clinic-text)",
  harlan: "var(--coal)",
  ironclad: "var(--iron-black)",
  mara: "var(--ink)",
  atelier: "var(--warm-text)",
};

const SIG_TEXT: Record<string, string> = {
  redline: "var(--paper)",
  volatile: "var(--vol-text)",
  ember: "var(--crema)",
  meridian: "var(--cream)",
  arbor: "var(--ivory)",
  clearview: "var(--clinic-bg)",
  harlan: "var(--paper)",
  ironclad: "var(--iron-text)",
  mara: "var(--bone)",
  atelier: "var(--warm-bg)",
};

const SIG_HOVER: Record<string, string> = {
  redline: "hover:text-[var(--signal)]",
  volatile: "hover:text-[var(--vol-accent)]",
  ember: "hover:text-[var(--flame)]",
  meridian: "hover:text-[var(--gold)]",
  arbor: "hover:text-[var(--clay)]",
  clearview: "hover:text-[var(--clinic-teal)]",
  harlan: "hover:text-[var(--brass)]",
  ironclad: "hover:text-[var(--iron-amber)]",
  mara: "hover:text-[var(--red)]",
  atelier: "hover:text-[var(--warm-accent)]",
};

export function FooterSection({ content, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const sig = getSigName(style.design?.signature);
  const { pages, pageBaseHref, locale, activePageId } = useSiteNav();
  const edge = style.theme.accentRole === "edge";
  const deep = style.theme.surface === "deep";

  const navLinks = pages.filter((p) => p.id !== "home");
  const pageHref = (slug: string): string =>
    slug === "" ? pageBaseHref || "/" : `${pageBaseHref}/${slug}`;

  const bg = SIG_BG[sig];
  const textColor = SIG_TEXT[sig];
  const hoverVar = SIG_HOVER[sig];

  if (bg) {
    return (
      <footer
        className="py-12"
        style={{
          backgroundColor: bg,
          color: textColor,
          borderTop: `1px solid ${
            edge || deep ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.2)"
          }`,
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="site-heading-sans text-lg font-bold tracking-tight">
              {businessInfo.name}
            </span>
            <F fieldKey="footer_text" content={content} className="text-sm" />
          </div>
          {navLinks.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {navLinks.map((p) => {
                const active = p.id === activePageId;
                return (
                  <a
                    key={p.id}
                    href={pageHref(p.slug)}
                    className={`transition-colors ${hoverVar} ${
                      active ? "font-semibold" : "opacity-70"
                    }`}
                  >
                    {p.name[locale]}
                  </a>
                );
              })}
            </nav>
          )}
          <p className="text-xs opacity-60">
            &copy; {new Date().getFullYear()} &mdash; {businessInfo.name}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`py-12 ${deep ? "border-t border-foreground/10" : edge ? "border-t border-foreground/15" : "border-t-4"}`}
      style={!edge && !deep ? { borderColor: "var(--brand)" } : undefined}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-1">
          <span className="site-heading-sans text-lg font-bold tracking-tight text-foreground">
            {businessInfo.name}
          </span>
          <F fieldKey="footer_text" content={content} className="site-body" />
        </div>
        {navLinks.length > 0 && (
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 site-body">
            {navLinks.map((p) => {
              const active = p.id === activePageId;
              return (
                <a
                  key={p.id}
                  href={pageHref(p.slug)}
                  className={`transition-colors hover:text-foreground ${
                    active ? "font-semibold text-foreground" : ""
                  }`}
                >
                  {p.name[locale]}
                </a>
              );
            })}
          </nav>
        )}
        <p className="site-body text-xs text-muted-foreground/70">
          &copy; {new Date().getFullYear()} &mdash; {businessInfo.name}
        </p>
      </div>
    </footer>
  );
}