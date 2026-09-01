"use client";

import { useTranslations } from "next-intl";

export type DeviceMode = "desktop" | "mobile";

export function DeviceToggle({
  mode,
  onChange,
}: {
  mode: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}) {
  const t = useTranslations();
  const options: { value: DeviceMode; key: string }[] = [
    { value: "desktop", key: "editor.device.desktop" },
    { value: "mobile", key: "editor.device.mobile" },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-paper p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={mode === opt.value}
          className={`vexa-display rounded-full px-3 py-1 text-lg leading-none transition-colors ${
            mode === opt.value
              ? "bg-vexa-red text-paper"
              : "text-ink hover:bg-paper-2"
          }`}
        >
          {t(opt.key)}
        </button>
      ))}
    </div>
  );
}
