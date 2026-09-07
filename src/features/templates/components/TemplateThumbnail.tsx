"use client";

import { useState } from "react";

/**
 * Thumbnail for a template card. Loads the configured screenshot
 * (`template.screenshot`, e.g. `/templates/<template-id>/screenshot.png`) when
 * provided, falls back to the prerendered SVG preview, and finally to the
 * template name if assets are missing.
 */
export function TemplateThumbnail({
  templateId,
  name,
  accent,
  className = "",
  screenshot,
}: {
  templateId: string;
  name: string;
  accent?: string;
  className?: string;
  screenshot?: string;
}) {
  const [screenshotFailed, setScreenshotFailed] = useState(false);
  const [svgFailed, setSvgFailed] = useState(false);

  if (screenshot && !screenshotFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={screenshot}
        alt={name}
        loading="lazy"
        className={`w-full rounded-[4px] object-cover ${className}`}
        style={accent ? { backgroundColor: accent } : undefined}
        onError={() => setScreenshotFailed(true)}
      />
    );
  }

  if (!svgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/templates/${templateId}/preview.svg`}
        alt={name}
        loading="lazy"
        className={`w-full rounded-[4px] object-cover ${className}`}
        style={accent ? { backgroundColor: accent } : undefined}
        onError={() => setSvgFailed(true)}
      />
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-[4px] bg-paper-2 p-4 ${className}`}
    >
      <p className="mono-display text-center font-semibold text-ink">{name}</p>
    </div>
  );
}