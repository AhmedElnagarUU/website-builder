import { F } from "../internals";
import { useSiteStyle, useSiteNav } from "../context";
import type { SectionRenderProps } from "./types";

export function FooterSection({ content, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const { pages, pageBaseHref, locale, activePageId } = useSiteNav();
  const edge = style.theme.accentRole === "edge";
  const deep = style.theme.surface === "deep";

  const navLinks = pages.filter((p) => p.id !== "home");
  const pageHref = (slug: string): string =>
    slug === "" ? pageBaseHref || "/" : `${pageBaseHref}/${slug}`;

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
          © {new Date().getFullYear()} — {businessInfo.name}
        </p>
      </div>
    </footer>
  );
}
