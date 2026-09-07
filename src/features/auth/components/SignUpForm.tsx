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

export function SignUpForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function clientValidate(): string | null {
    if (password.length < 8) {
      return t("auth.hint.password");
    }
    if (password !== confirm) {
      return t("auth.error.password_mismatch");
    }
    return null;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = clientValidate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
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

    router.push(`/${locale}/dashboard`);
    router.refresh();
  }

  return (
    <Card className="mono-surface w-full max-w-md bg-card/95 shadow-mono">
      <div className="flex flex-col gap-6 p-8">
        <div className="mono-display flex items-baseline gap-1.5 text-3xl font-bold text-ink">
          <span>{t("app.name")}</span>
          <span className="mono-display text-lg text-mono-red">✱</span>
        </div>
        <SectionHead title={t("auth.sign_up.title")} />
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
          <p className="text-center text-sm text-ink-3">
            <a href={`/${locale}/auth/sign-in`} className="underline hover:text-mono-red">
              {t("auth.link.to_sign_in")}
            </a>
          </p>
        </form>
      </div>
    </Card>
  );
}