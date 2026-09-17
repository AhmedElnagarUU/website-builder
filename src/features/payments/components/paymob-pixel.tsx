"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

export interface PaymobPixelProps {
  clientSecret: string;
  publicKey: string;
  paymentMethods: string[];
  onComplete: () => void;
  onCancel?: () => void;
  onError: (messageKey: string) => void;
}

interface PaymobPixelStyle {
  Direction?: "ltr" | "rtl";
}

interface PaymobPixelOptions {
  publicKey: string;
  clientSecret: string;
  paymentMethods: string[];
  elementId: string;
  afterPaymentComplete?: () => void;
  onPaymentCancel?: () => void;
  customStyle?: PaymobPixelStyle;
}

interface PaymobPixelInstance {
  destroy?: () => void;
}

declare global {
  interface Window {
    Pixel?: new (options: PaymobPixelOptions) => PaymobPixelInstance;
  }
}

const PIXEL_STYLE_URLS = [
  "https://cdn.jsdelivr.net/npm/paymob-pixel@latest/styles.css",
  "https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.css",
];

const PIXEL_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.js";

let pixelAssetsLoaded: Promise<void> | null = null;

function ensurePixelAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (pixelAssetsLoaded) return pixelAssetsLoaded;
  pixelAssetsLoaded = new Promise<void>((resolve, reject) => {
    for (const styleUrl of PIXEL_STYLE_URLS) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = styleUrl;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = PIXEL_SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => {
      pixelAssetsLoaded = null;
      reject(new Error("Paymob Pixel failed to load"));
    };
    document.head.appendChild(script);
  });
  return pixelAssetsLoaded;
}

export function PaymobPixel({
  clientSecret,
  publicKey,
  paymentMethods,
  onComplete,
  onCancel,
  onError,
}: PaymobPixelProps) {
  const locale = useLocale();
  const instanceRef = useRef<PaymobPixelInstance | null>(null);
  const initializedRef = useRef(false);
  const callbacksRef = useRef({ onComplete, onCancel, onError });

  useEffect(() => {
    callbacksRef.current = { onComplete, onCancel, onError };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    let active = true;

    async function setupPixel() {
      try {
        await ensurePixelAssets();
        if (!active || initializedRef.current) return;
        const element = document.getElementById("paymob-elements");
        const PixelCtor = window.Pixel;
        if (!element || typeof PixelCtor !== "function") {
          throw new Error("Paymob Pixel is not ready");
        }
        initializedRef.current = true;
        const customStyle: PaymobPixelStyle = {};
        if (locale === "ar") {
          customStyle.Direction = "rtl";
        }
        instanceRef.current = new PixelCtor({
          publicKey,
          clientSecret,
          paymentMethods,
          elementId: "paymob-elements",
          afterPaymentComplete: () => {
            if (active) callbacksRef.current.onComplete();
          },
          onPaymentCancel: () => {
            if (active) callbacksRef.current.onCancel?.();
          },
          customStyle,
        });
      } catch {
        if (active) callbacksRef.current.onError("checkout.provider_error");
      }
    }

    setupPixel();

    return () => {
      active = false;
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, [locale, publicKey, clientSecret, paymentMethods]);

  return <div id="paymob-elements" className="w-full" />;
}