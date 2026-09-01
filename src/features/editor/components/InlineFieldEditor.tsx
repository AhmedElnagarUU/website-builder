"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function InlineFieldEditor({
  initialValue,
  maxWords,
  maxChars,
  onCommit,
}: {
  initialValue: string;
  maxWords?: number;
  maxChars?: number;
  onCommit: (value: string) => void;
}) {
  const t = useTranslations();
  const [raw, setRaw] = useState(initialValue);
  const [tooLong, setTooLong] = useState(false);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const multiline = Boolean(maxChars && maxChars > 60);

  const isTooLong = (value: string): boolean => {
    if (maxWords !== undefined && countWords(value) > maxWords) return true;
    if (maxChars !== undefined && value.length > maxChars) return true;
    return false;
  };

  useEffect(() => {
    ref.current?.focus();
    if (ref.current instanceof HTMLInputElement || ref.current instanceof HTMLTextAreaElement) {
      ref.current.select();
    }
  }, []);

  const commit = () => {
    if (isTooLong(raw)) {
      setTooLong(true);
      return;
    }
    onCommit(raw.trim());
  };

  const handleBlur = () => {
    if (isTooLong(raw)) {
      setTooLong(true);
      setTimeout(() => ref.current?.focus(), 0);
      return;
    }
    onCommit(raw.trim());
  };

  const common =
    "w-full rounded-[2px] border-2 bg-paper px-2 py-1 font-body text-sm text-ink outline-none " +
    (tooLong ? "border-vexa-red" : "border-vexa-red/70");

  return (
    <span className="block">
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (tooLong && !isTooLong(e.target.value)) setTooLong(false);
          }}
          onBlur={handleBlur}
          rows={3}
          className={common}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (tooLong && !isTooLong(e.target.value)) setTooLong(false);
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          className={common}
        />
      )}
      {tooLong && (
        <span className="mt-1 block text-xs font-medium text-vexa-red" role="alert">
          {t("editor.edit.field_too_long")}
        </span>
      )}
    </span>
  );
}
