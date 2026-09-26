import { z } from "zod";

export const CATEGORY_IDS = [
  "services",
  "restaurant",
  "retail",
  "professional",
  "portfolio",
  "construction",
  "interior_design",
  "law",
  "software_it",
  "real_estate",
  "beauty_fitness",
  "education",
  "automotive",
  "events",
  "travel",
  "b2b",
  "clinics",
] as const;

const trimmedString = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().max(max));

export const businessInfoPatchSchema = z
  .object({
    name: trimmedString(120).optional(),
    category: z.enum(CATEGORY_IDS).optional(),
    description: trimmedString(2000).optional(),
    targetCustomers: trimmedString(2000).optional(),
    services: trimmedString(2000).optional(),
    location: trimmedString(2000).optional(),
    contactPhone: trimmedString(40).optional(),
    contactEmail: z
      .string()
      .trim()
      .max(200)
      .email()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    usps: z
      .array(z.string().trim().max(140))
      .max(5)
      .optional(),
    notes: z
      .array(z.string().trim().max(500))
      .max(5)
      .optional(),
    advance: z.boolean().optional(),
  })
  .strip();

export type BusinessInfoPatch = z.infer<typeof businessInfoPatchSchema>;

export const contentPatchSchema = z
  .object({
    locale: z.enum(["en", "ar"]),
    pageId: z.string().min(1).default("home"),
    updates: z.record(z.string(), z.string().trim().max(2000)),
  })
  .strip();

export type ContentPatch = z.infer<typeof contentPatchSchema>;