"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BRAND_PALETTE } from "@/shared/lib/brand-palette";

export function BrandColorControl({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (color: string) => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const current = value.toLowerCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="mono-display flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-lg leading-none text-ink transition-colors hover:bg-paper-2"
      >
        <span
          className="h-4 w-4 rounded-full border-2 border-ink"
          style={{ backgroundColor: value }}
        />
        <span>{t("editor.color.label")}</span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t("editor.color.label")}
          className="absolute end-0 z-10 mt-2 flex max-w-[180px] flex-wrap gap-2 rounded-[4px] border-2 border-ink bg-paper p-2 shadow-mono"
        >
          {BRAND_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              role="option"
              aria-selected={c === current}
              aria-label={c}
              onClick={() => {
                onSelect(c);
                setOpen(false);
              }}
              className={`h-6 w-6 rounded-full border-2 ${
                c === current ? "border-mono-red ring-2 ring-mono-red" : "border-ink/40"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
