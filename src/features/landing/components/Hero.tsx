import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import { StickyNote } from "@/shared/ui/StickyNote";

export function Hero() {
  const t = useTranslations("landing.hero");
  const locale = useLocale();
  return (
    <section className="vexo-container pt-10 pb-16">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.1em] text-ink-3">
        <span className="vexa-display text-xl leading-none text-vexa-red">★</span>
        <span className="font-semibold text-ink">{t("meta.kicker")}</span>
        <span aria-hidden className="hidden sm:inline">
          —
        </span>
        <span className="hidden sm:inline">{t("meta.note")}</span>
      </div>

      <div className="mt-8 grid items-end gap-8 lg:grid-cols-[7fr_5fr]">
        <h1 className="vexa-display text-[clamp(48px,7.6vw,112px)] font-bold leading-[0.96] tracking-tight text-ink">
          {t("headline.line1")}
          <br />
          <em className="not-italic text-vexa-red underline decoration-wavy decoration-vexa-blue underline-offset-4">
            {t("headline.line2")}
          </em>
          <br />
          <span className="text-vexa-blue underline decoration-3 underline-offset-4">
            {t("headline.line3")}
          </span>
          <span className="font-body mt-5 block font-mono text-sm font-normal italic tracking-[0.04em] text-ink-2">
            {t("headline.small")}
          </span>
        </h1>

        <div className="hidden lg:block">
          <StickyNote>
            <p className="vexa-display text-xl leading-snug text-ink">
              {t("note.body")}
            </p>
            <p className="mt-2 text-start text-base text-ink-3">
              {t("note.signoff")}
            </p>
          </StickyNote>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <p className="font-serif2 max-w-[480px] text-[17px] leading-relaxed text-ink-2">
          {t.rich("deck", {
            b: (chunks) => <strong className="font-bold text-ink">{chunks}</strong>,
            u: (chunks) => (
              <span className="bg-[linear-gradient(transparent_60%,var(--vexa-yellow)_60%)] px-0.5">
                {chunks}
              </span>
            ),
          })}
        </p>
        <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
          <a href={`/${locale}/auth/sign-up`}>
            <Button variant="primary">
              {t("cta.start")} <span className="rtl:rotate-180">→</span>
            </Button>
          </a>
          <a href="#features">
            <Button variant="default">{t("cta.example")}</Button>
          </a>
          <span className="w-full font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 md:w-auto">
            {t("cta.assure")}
          </span>
        </div>
      </div>
    </section>
  );
}
