import { z } from "zod";
import { locales } from "@/shared/i18n/config";

export const businessItemKindSchema = z.enum([
  "service",
  "menu_item",
  "gallery_item",
  "hours",
  "contact",
]);

export const businessContactTypeSchema = z.enum([
  "phone",
  "whatsapp",
  "email",
  "address",
  "instagram",
  "facebook",
  "maps",
]);

export const localeSchema = z.enum(locales);

const trimmedString = (max: number) => z.string().trim().max(max);
const optionalTrimmedString = (max: number) => trimmedString(max).optional();
const timeString = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:MM");

export const serviceItemDataSchema = z
  .object({
    name: trimmedString(120),
    description: trimmedString(2000).default(""),
    price: optionalTrimmedString(40),
    imageS3Key: optionalTrimmedString(512),
  })
  .strict();

export const menuItemDataSchema = z
  .object({
    name: trimmedString(120),
    description: trimmedString(2000).default(""),
    price: optionalTrimmedString(40),
    imageS3Key: optionalTrimmedString(512),
  })
  .strict();

export const galleryItemDataSchema = z
  .object({
    title: optionalTrimmedString(120),
    imageS3Key: trimmedString(512),
  })
  .strict();

export const hoursDataSchema = z
  .object({
    dayIndex: z.number().int().min(0).max(6),
    open: timeString.optional(),
    close: timeString.optional(),
    closed: z.boolean().default(false),
  })
  .strict();

export const contactDataSchema = z
  .object({
    type: businessContactTypeSchema,
    value: trimmedString(200),
    label: optionalTrimmedString(80),
  })
  .strict();

const namedItemDataPatchSchema = z
  .object({
    name: trimmedString(120).optional(),
    description: trimmedString(2000).optional(),
    price: optionalTrimmedString(40),
    imageS3Key: optionalTrimmedString(512),
  })
  .strict();

const serviceItemDataPatchSchema = namedItemDataPatchSchema;
const menuItemDataPatchSchema = namedItemDataPatchSchema;

const galleryItemDataPatchSchema = z
  .object({
    title: optionalTrimmedString(120),
    imageS3Key: trimmedString(512).optional(),
  })
  .strict();

const hoursDataPatchSchema = z
  .object({
    dayIndex: z.number().int().min(0).max(6).optional(),
    open: timeString.optional(),
    close: timeString.optional(),
    closed: z.boolean().optional(),
  })
  .strict();

const contactDataPatchSchema = z
  .object({
    type: businessContactTypeSchema.optional(),
    value: trimmedString(200).optional(),
    label: optionalTrimmedString(80),
  })
  .strict();

const createCommonFields = {
  locale: localeSchema,
  baseKey: optionalTrimmedString(80),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
};

export const createBusinessItemSchema = z.discriminatedUnion("kind", [
  z.object({
    ...createCommonFields,
    kind: z.literal("service"),
    data: serviceItemDataSchema,
  }),
  z.object({
    ...createCommonFields,
    kind: z.literal("menu_item"),
    data: menuItemDataSchema,
  }),
  z.object({
    ...createCommonFields,
    kind: z.literal("gallery_item"),
    data: galleryItemDataSchema,
  }),
  z.object({
    ...createCommonFields,
    kind: z.literal("hours"),
    data: hoursDataSchema,
  }),
  z.object({
    ...createCommonFields,
    kind: z.literal("contact"),
    data: contactDataSchema,
  }),
]);

const updateCommonFields = {
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
};

export const updateBusinessItemSchema = z.discriminatedUnion("kind", [
  z.object({
    ...updateCommonFields,
    kind: z.literal("service"),
    data: serviceItemDataPatchSchema.optional(),
  }),
  z.object({
    ...updateCommonFields,
    kind: z.literal("menu_item"),
    data: menuItemDataPatchSchema.optional(),
  }),
  z.object({
    ...updateCommonFields,
    kind: z.literal("gallery_item"),
    data: galleryItemDataPatchSchema.optional(),
  }),
  z.object({
    ...updateCommonFields,
    kind: z.literal("hours"),
    data: hoursDataPatchSchema.optional(),
  }),
  z.object({
    ...updateCommonFields,
    kind: z.literal("contact"),
    data: contactDataPatchSchema.optional(),
  }),
]);

export const listBusinessItemsQuerySchema = z.object({
  kind: businessItemKindSchema.optional(),
  locale: localeSchema.optional(),
  includeInactive: z.enum(["true", "false"]).optional(),
});

export type CreateBusinessItemBody = z.infer<typeof createBusinessItemSchema>;
export type UpdateBusinessItemBody = z.infer<typeof updateBusinessItemSchema>;
export type ListBusinessItemsQuery = z.infer<typeof listBusinessItemsQuerySchema>;
