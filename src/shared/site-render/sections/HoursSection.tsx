import { useTranslations } from "next-intl";
import { F } from "../internals";
import { useSiteBrand } from "../context";
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
  const { brandColor } = useSiteBrand();

  return (
    <section id="hours" className="py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <F fieldKey="hours_title" content={content} as="h2" className="text-3xl font-bold" />
        </div>
        <div className="divide-y divide-border">
          {DAY_KEYS.map((key, i) => (
            <div key={key} className="flex items-center justify-between gap-4 py-3">
              <p className="font-medium">{t(`days.${i}`)}</p>
              <F fieldKey={key} content={content} fallback="—" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
