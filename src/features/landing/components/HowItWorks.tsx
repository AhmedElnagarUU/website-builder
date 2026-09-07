import { useTranslations } from "next-intl";
import { SectionHead } from "@/shared/ui/SectionHead";

const STEPS = ["one", "two", "three"];

export function HowItWorks() {
  const t = useTranslations("landing.how");
  return (
    <section
      id="how"
      className="mono-band w-full border-y-2 border-ink bg-paper-2 py-14 lg:py-20"
    >
      <div className="mono-container">
        <SectionHead
          size="lg"
          tab={t("tab")}
          title={t.rich("title", {
            em: (chunks) => <em className="not-italic text-mono-red">{chunks}</em>,
          })}
        />
        <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {STEPS.map((key) => (
            <article
              key={key}
              className="relative rounded-[4px] border-[1.5px] border-ink bg-paper p-7 shadow-mono"
            >
              <div className="mono-display mb-2 text-[22px] text-mono-red">
                {t(`${key}.ch`)}
              </div>
              <h3 className="mono-display text-[30px] font-bold leading-tight tracking-tight text-ink">
                {t(`${key}.title`)}
              </h3>
              <p className="font-serif2 mt-2.5 max-w-[320px] text-[15px] leading-relaxed text-ink-2">
                {t(`${key}.body`)}
              </p>
              <dl className="mt-4 border-t-[1.5px] border-dashed border-ink/30 pt-3 font-mono text-[11px] uppercase leading-[1.7] tracking-[0.06em] text-ink-3">
                <dt className="sr-only">Details</dt>
                <dd>
                  <b className="font-semibold not-italic text-ink">{t(`${key}.detail.time_label`)}</b>{" "}
                  {t(`${key}.detail.time`)}
                </dd>
                <dd>
                  <b className="font-semibold not-italic text-ink">{t(`${key}.detail.see_label`)}</b>{" "}
                  {t(`${key}.detail.see`)}
                </dd>
                <dd>
                  <b className="font-semibold not-italic text-ink">{t(`${key}.detail.can_label`)}</b>{" "}
                  {t(`${key}.detail.can`)}
                </dd>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
