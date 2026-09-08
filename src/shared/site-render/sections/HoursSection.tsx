import { useTranslations } from "next-intl";
import { F } from "../internals";
import { useSiteStyle } from "../context";
import { SectionHead } from "../atoms";
import type { SectionRenderProps } from "./types";

const DAY_KEYS = [
  "hours_monday",
  "hours_tuesday",
  "hours_wednesday",
  "hours_thursday",
  "hours_friday",
  "hours_saturday",
  "hours_sunday",
];

export function HoursSection({ content }: SectionRenderProps) {
  const t = useTranslations("site");
  const style = useSiteStyle();
  const { theme } = style;

  return (
    <section id="hours" className="py-20">
      <div className="mx-auto max-w-2xl px-4">
        <SectionHead fieldKey="hours_title" content={content} align="centered" />
        <div
          className={`divide-y divide-border ${theme.surface === "deep" ? "bg-card" : "bg-background"} rounded-lg border border-foreground/10`}
        >
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <p className="site-body font-medium">{t(`days.${i}`)}</p>
              <F fieldKey={key} content={content} fallback="—" className="site-body" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
