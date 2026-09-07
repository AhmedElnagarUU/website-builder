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

export function SignInForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(t("auth.error.invalid_credentials"));
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
        <SectionHead title={t("auth.sign_in.title")} />
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-mono-red">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="mt-1">
            {loading ? t("common.loading") : t("auth.action.sign_in")}
          </Button>
          <p className="text-center text-sm text-ink-3">
            <a href={`/${locale}/auth/sign-up`} className="underline hover:text-mono-red">
              {t("auth.link.to_sign_up")}
            </a>
          </p>
        </form>
      </div>
    </Card>
  );
}