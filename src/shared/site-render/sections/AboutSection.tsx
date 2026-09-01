import { F } from "../internals";
import type { SectionRenderProps } from "./types";

export function AboutSection({ content }: SectionRenderProps) {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <F fieldKey="about_title" content={content} as="h2" className="mb-6 text-3xl font-bold" />
        <F fieldKey="about_body" content={content} as="p" className="text-lg leading-relaxed text-muted-foreground" />
      </div>
    </section>
  );
}
