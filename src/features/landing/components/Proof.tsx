import { useTranslations } from "next-intl";
import { SectionHead } from "@/shared/ui/SectionHead";

const QUOTES = ["faisal", "noura", "reem"];

const CARD_STYLES = [
  "bg-vexa-yellow rotate-0",
  "bg-[#F5E5B8] -rotate-1",
  "bg-[#E8D4A6] rotate-[0.6deg]",
];

export function Proof() {
  const t = useTranslations("landing.proof");
  return (
    <section id="proof" className="py-14 lg:py-20">
      <div className="vexo-container">
        <SectionHead
          size="lg"
          tab={t("tab")}
          title={t.rich("title", {
            em: (chunks) => <em className="not-italic text-vexa-red">{chunks}</em>,
          })}
        />
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {QUOTES.map((key, i) => (
            <figure
              key={key}
              className={`relative rounded-[4px] border-[1.5px] border-ink p-7 shadow-vexa ${CARD_STYLES[i]}`}
            >
              <blockquote className="vexa-display text-[22px] font-medium leading-[1.35] tracking-tight text-ink">
                {t.rich(`${key}.quote`, {
                  em: (chunks) => (
                    <em className="not-italic text-vexa-red">{chunks}</em>
                  ),
                })}
              </blockquote>
              <figcaption className="vexa-display mt-4 border-t-[1.5px] border-dashed border-ink/30 pt-3 text-[17px] text-ink-2">
                <b className="font-bold text-ink">{t(`${key}.name`)}</b>{" "}
                · {t(`${key}.meta`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
