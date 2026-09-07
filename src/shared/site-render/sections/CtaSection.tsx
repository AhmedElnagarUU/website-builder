import { CtaBand } from "../atoms";
import type { SectionRenderProps } from "./types";

export function CtaSection({ content }: SectionRenderProps) {
  return <CtaBand headlineKey="cta_headline" buttonLabelKey="cta_button_label" content={content} />;
}
