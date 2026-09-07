"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "default" | "ghost";

/**
 * Vexo pill button (source: variant-14 .btn / .btn-primary).
 * Colorless logical sizing; use `ms-*`/`me-*` and `rtl:rotate-180` for arrows.
 */
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className = "", variant = "primary", children, ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 font-display text-lg font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<Variant, string> = {
    primary:
      "border-mono-red bg-mono-red text-paper hover:border-ink hover:bg-ink",
    default: "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
    ghost:
      "border-transparent bg-transparent text-ink hover:text-mono-red",
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
