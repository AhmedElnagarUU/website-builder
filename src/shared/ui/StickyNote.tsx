import type { ReactNode } from "react";

/**
 * Vexo sticky-note / annotation (source: variant-14 .annotation).
 * A rotated paper note with a red ✱ marker and a hard offset shadow; used for
 * tips, guidance and inline prompts.
 */
export function StickyNote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative -rotate-1 max-w-xs p-3 ${className}`}>
      <span
        aria-hidden
        className="vexa-display absolute -top-1 -start-1 text-2xl leading-none text-vexa-red"
      >
        ✱
      </span>
      <div className="rounded-[4px] border-[1.5px] border-ink bg-paper px-3.5 py-3 shadow-vexa">
        {children}
      </div>
    </div>
  );
}
