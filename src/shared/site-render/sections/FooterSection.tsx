import { F } from "../internals";
import { useSiteStyle } from "../context";
import type { SectionRenderProps } from "./types";

export function FooterSection({ content, businessInfo }: SectionRenderProps) {
  const style = useSiteStyle();
  const edge = style.theme.accentRole === "edge";

  return (
    <footer
      className={`py-10 ${
        edge ? "border-t border-foreground/15" : "border-t-4"
      }`}
      style={edge ? undefined : { borderColor: "var(--brand)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <span className="site-body font-medium text-foreground">{businessInfo.name}</span>
        <F fieldKey="footer_text" content={content} className="site-body" />
      </div>
    </footer>
  );
}
