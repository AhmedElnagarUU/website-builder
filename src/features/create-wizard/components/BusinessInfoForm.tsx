"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Textarea } from "@/shared/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { SectionHead } from "@/shared/ui/SectionHead";
import { Stepper } from "@/shared/ui/Stepper";
import { useAutosaveForm } from "@/features/create-wizard/lib/useAutosaveForm";
import { CATEGORIES, filterCategories } from "@/features/create-wizard/lib/categories";
import type { Locale, SiteDTO } from "@/features/sites/types";

interface FormValues extends Record<string, unknown> {
  name: string;
  category: string;
  description: string;
  targetCustomers: string;
  services: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  usps: string[];
  notes: string[];
}

function fromDto(dto: SiteDTO): FormValues {
  const b = dto.businessInfo;
  return {
    name: b.name ?? "",
    category: (b.category as string | undefined) ?? "",
    description: b.description ?? "",
    targetCustomers: b.targetCustomers ?? "",
    services: b.services ?? "",
    location: b.location ?? "",
    contactPhone: b.contactPhone ?? "",
    contactEmail: b.contactEmail ?? "",
    usps: b.usps ?? [],
    notes: b.notes ?? [],
  };
}

function toPatch(v: FormValues): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if (v.name !== "") patch.name = v.name;
  if (v.category !== "") patch.category = v.category;
  if (v.description !== "") patch.description = v.description;
  if (v.targetCustomers !== "") patch.targetCustomers = v.targetCustomers;
  if (v.services !== "") patch.services = v.services;
  if (v.location !== "") patch.location = v.location;
  if (v.contactPhone !== "") patch.contactPhone = v.contactPhone;
  if (v.contactEmail !== "") patch.contactEmail = v.contactEmail;
  if (v.usps.length > 0) patch.usps = v.usps;
  if (v.notes.length > 0) patch.notes = v.notes;
  return patch;
}

export function BusinessInfoForm({
  siteId,
  initial,
  locale,
}: {
  siteId: string;
  initial: SiteDTO;
  locale: Locale;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [touched, setTouched] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [showCategoryList, setShowCategoryList] = useState(false);

  const save = async (values: FormValues): Promise<{ ok: boolean }> => {
    try {
      const res = await fetch(`/api/sites/${siteId}/business-info`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPatch(values)),
      });
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  };

  const { values, setField, setValues, state } = useAutosaveForm<FormValues>(
    fromDto(initial),
    save
  );

  const filteredCategories = filterCategories(categoryQuery, locale);
  const selectedCategory = CATEGORIES.find((c) => c.id === values.category);

  const nameError = touched && values.name.trim() === "";
  const categoryError = touched && values.category === "";
  const canContinue = values.name.trim() !== "" && values.category !== "";

  async function onContinue() {
    setTouched(true);
    if (!canContinue) return;
    const res = await fetch(`/api/sites/${siteId}/business-info`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...toPatch(values), advance: true }),
    });
    if (res.ok) {
      startTransition(() => {
        router.push(`/${locale}/create/templates?site=${siteId}`);
        router.refresh();
      });
    }
  }

  function updateUsp(idx: number, val: string) {
    const next = [...values.usps];
    next[idx] = val;
    setField("usps", next);
  }
  function addUsp() {
    if (values.usps.length >= 5) return;
    setField("usps", [...values.usps, ""]);
  }
  function removeUsp(idx: number) {
    setField("usps", values.usps.filter((_, i) => i !== idx));
  }
  function updateNote(idx: number, val: string) {
    const next = [...values.notes];
    next[idx] = val;
    setField("notes", next);
  }
  function addNote() {
    if (values.notes.length >= 5) return;
    setField("notes", [...values.notes, ""]);
  }
  function removeNote(idx: number) {
    setField("notes", values.notes.filter((_, i) => i !== idx));
  }

  return (
    <div className="mono-surface mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <Stepper
          steps={[
            { key: "business", label: t("wizard.stepper.business") },
            { key: "templates", label: t("wizard.stepper.templates") },
            { key: "language", label: t("wizard.stepper.language") },
            { key: "generating", label: t("wizard.stepper.generating") },
          ]}
          currentKey="business"
        />
        <SectionHead title={t("wizard.business.title")} />
        <span className="text-xs text-ink-3" aria-live="polite">
          {state === "saving" ? t("common.loading") : state === "saved" ? t("common.saved") : ""}
        </span>
      </div>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("wizard.business.group.about")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("wizard.business.field.name")} *</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={nameError}
            />
            {nameError && (
              <p role="alert" className="text-sm text-mono-red">
                {t("wizard.business.error.name_required")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">{t("wizard.business.field.category")} *</Label>
            <div className="relative">
              <Input
                id="category"
                name="category"
                autoComplete="off"
                value={showCategoryList ? categoryQuery : selectedCategory?.labels[locale] ?? ""}
                placeholder={t("wizard.business.field.category_placeholder")}
                onFocus={() => {
                  setShowCategoryList(true);
                  setCategoryQuery("");
                }}
                onChange={(e) => {
                  setCategoryQuery(e.target.value);
                  setShowCategoryList(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowCategoryList(false);
                    setTouched(true);
                  }, 150);
                }}
                aria-invalid={categoryError}
              />
              {showCategoryList && filteredCategories.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[4px] border-2 border-ink bg-paper shadow-mono">
                  {filteredCategories.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="block w-full px-3 py-2 text-start font-body text-sm text-ink hover:bg-mono-yellow/30"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setValues({ category: c.id });
                          setCategoryQuery("");
                          setShowCategoryList(false);
                        }}
                      >
                        {c.labels[locale]}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {categoryError && (
              <p role="alert" className="text-sm text-mono-red">
                {t("wizard.business.error.category_required")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">{t("wizard.business.field.description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("wizard.business.group.customers")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="targetCustomers">{t("wizard.business.field.target_customers")}</Label>
            <Textarea
              id="targetCustomers"
              name="targetCustomers"
              value={values.targetCustomers}
              onChange={(e) => setField("targetCustomers", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="services">{t("wizard.business.field.services")}</Label>
            <Textarea
              id="services"
              name="services"
              value={values.services}
              onChange={(e) => setField("services", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("wizard.business.group.contact")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">{t("wizard.business.field.location")}</Label>
            <Input
              id="location"
              name="location"
              value={values.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactPhone">{t("wizard.business.field.phone")}</Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              inputMode="tel"
              value={values.contactPhone}
              onChange={(e) => setField("contactPhone", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactEmail">{t("wizard.business.field.email")}</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              inputMode="email"
              value={values.contactEmail}
              onChange={(e) => setField("contactEmail", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Extra */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("wizard.business.group.extra")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t("wizard.business.field.usps")}</Label>
            {values.usps.map((usp, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={usp}
                  onChange={(e) => updateUsp(idx, e.target.value)}
                  maxLength={140}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 w-11 shrink-0 px-0 text-2xl"
                  onClick={() => removeUsp(idx)}
                >
                  ×
                </Button>
              </div>
            ))}
            {values.usps.length < 5 && (
              <Button
                type="button"
                variant="default"
                className="self-start"
                onClick={addUsp}
              >
                {t("wizard.business.action.add_line")}
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t("wizard.business.field.notes")}</Label>
            {values.notes.map((note, idx) => (
              <div key={idx} className="flex gap-2">
                <Textarea
                  value={note}
                  onChange={(e) => updateNote(idx, e.target.value)}
                  maxLength={500}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-[88px] w-11 shrink-0 px-0 text-2xl"
                  onClick={() => removeNote(idx)}
                >
                  ×
                </Button>
              </div>
            ))}
            {values.notes.length < 5 && (
              <Button
                type="button"
                variant="default"
                className="self-start"
                onClick={addNote}
              >
                {t("wizard.business.action.add_line")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button type="button" onClick={onContinue} disabled={!canContinue || isPending}>
          {t("wizard.common.continue")}
        </Button>
      </div>
    </div>
  );
}
