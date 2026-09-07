import type { ReactNode } from "react";

/**
 * Vexo tape tag (source: variant-14 .tag).
 * A translucent yellow sticker with a blur and a slight rotation, typically
 * clipped to the top-start corner of a card to flag something.
 */
export function TapeTag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`mono-display inline-block rotate-[2deg] rounded-sm bg-mono-tape px-3 py-1 text-base leading-none text-ink backdrop-blur-[2px] shadow-sm ${className}`}
    >
      {children}
    </span>
  );
}
