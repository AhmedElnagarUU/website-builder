"use client";

import { useState } from "react";

/**
 * Static visual thumbnail for a template. Renders the prerendered SVG preview
 * for the template and falls back to the template name if the asset is missing.
 */
export function TemplateThumbnail({
  templateId,
  name,
  accent,
  className = "",
}: {
  templateId: string;
  name: string;
  accent?: string;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-[4px] bg-paper-2 p-4 ${className}`}
      >
        <p className="vexa-display text-center font-semibold text-ink">{name}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/templates/${templateId}/preview.svg`}
      alt={name}
      loading="lazy"
      className={`w-full rounded-[4px] object-cover ${className}`}
      style={accent ? { backgroundColor: accent } : undefined}
      onError={() => setImageError(true)}
    />
  );
}
