import { F } from "../internals";
import type { SectionRenderProps } from "./types";

export function FooterSection({ content, businessInfo }: SectionRenderProps) {
  return (
    <footer className="border-t border-input bg-background py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-muted-foreground">
        <span className="font-medium">{businessInfo.name}</span>
        <F fieldKey="footer_text" content={content} />
      </div>
    </footer>
  );
}
