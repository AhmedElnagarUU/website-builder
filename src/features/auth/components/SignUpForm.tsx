"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/shared/auth/client";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Card } from "@/shared/ui/Card";
import { SectionHead } from "@/shared/ui/SectionHead";
import { validateAndNormalizePhone } from "@/features/auth/lib/phone";

type Step = "phone" | "account";

export function SignUpForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function clientValidatePhone(): string | null {
    if (!phone.trim()) return t("auth.field.phone");
    const normalized = validateAndNormalizePhone(phone);
    if (!normalized) return t("auth.error.invalid_phone");
    return null;
  }

  function clientValidateAccount(): string | null {
    if (password.length < 8) return t("auth.hint.password");
    if (password !== confirm) return t("auth.error.password_mismatch");
    return null;
  }

  async function onSubmitPhone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const err = clientValidatePhone();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      // Check phone uniqueness via our API
      const checkRes = await fetch("/api/auth/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const check = await checkRes.json();
      if (check.available === false) {
        setError(t("auth.error.phone_registered"));
        setLoading(false);
        return;
      }
      setStep("account");
      setLoading(false);
    } catch {
      setError(t("common.error.generic"));
      setLoading(false);
    }
  }

  async function onSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const accountErr = clientValidateAccount();
    if (accountErr) { setError(accountErr); return; }

    setLoading(true);
    try {
      const { error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (authError) {
        const message = authError.message?.toLowerCase().includes("already")
          ? t("auth.error.email_exists")
          : t("common.error.generic");
        setError(message);
        setLoading(false);
        return;
      }
      // Store the phone identity now that the account exists.
      // The /api/auth/store-phone endpoint reads the session for userId
      // and uses the phone number's unique index to prevent races.
      await fetch("/api/auth/store-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(t("common.error.generic"));
      setLoading(false);
    }
  }

  return (
    <Card className="mono-surface w-full max-w-md bg-card/95 shadow-mono">
      <div className="flex flex-col gap-6 p-8">
        <div className="mono-display flex items-baseline gap-1.5 text-3xl font-bold text-ink">
          <span>{t("app.name")}</span>
          <span className="mono-display text-lg text-mono-red">✱</span>
        </div>

        {step === "phone" && (
          <>
            <SectionHead title={t("auth.sign_up.title")} />
            <form onSubmit={onSubmitPhone} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">{t("auth.field.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-ink-3">
                  {t("auth.hint.phone")}
                </p>
              </div>
              {error && (
                <p role="alert" className="text-sm font-medium text-mono-red">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? t("common.loading") : t("auth.action.continue")}
              </Button>
            </form>
          </>
        )}

        {step === "account" && (
          <>
            <SectionHead title={t("auth.sign_up.title")} />
            <form onSubmit={onSignUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t("auth.field.name")}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t("auth.field.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">{t("auth.field.password")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-ink-3">{t("auth.hint.password")}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm">{t("auth.field.password_confirm")}</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              {error && (
                <p role="alert" className="text-sm font-medium text-mono-red">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? t("common.loading") : t("auth.action.sign_up")}
              </Button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-center text-sm text-ink-2 underline hover:text-mono-red"
              >
                {t("auth.link.change_phone")}
              </button>
            </form>
          </>
        )}
      </div>
    </Card>
  );
}
