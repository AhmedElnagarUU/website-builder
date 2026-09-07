"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { PaywallPrompt } from "./PaywallPrompt";
import type { PaywallInfo } from "../lib/paywall-client";

interface PaywallContextValue {
  showPaywall: (info: PaywallInfo) => void;
  closePaywall: () => void;
}

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [paywall, setPaywall] = useState<PaywallInfo | null>(null);

  const showPaywall = useCallback((info: PaywallInfo) => {
    setPaywall(info);
  }, []);

  const closePaywall = useCallback(() => {
    setPaywall(null);
  }, []);

  return (
    <PaywallContext.Provider value={{ showPaywall, closePaywall }}>
      {children}
      {paywall && (
        <PaywallPrompt paywall={paywall} onClose={closePaywall} />
      )}
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallContextValue {
  const ctx = useContext(PaywallContext);
  if (!ctx) {
    throw new Error("usePaywall must be used within PaywallProvider");
  }
  return ctx;
}