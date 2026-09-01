"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`flex min-h-[88px] w-full rounded-[4px] border-2 border-ink bg-paper px-3 py-2 font-body text-sm text-ink ring-offset-background placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
