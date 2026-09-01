"use client";

import { forwardRef, type LabelHTMLAttributes } from "react";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = "", children, ...props }, ref) => (
    <label
      ref={ref}
      className={`font-body text-sm font-semibold leading-none text-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = "Label";
