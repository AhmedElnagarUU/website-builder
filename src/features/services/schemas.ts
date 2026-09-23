import { z } from "zod";

const trimmedString = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().max(max));

export const createServiceSchema = z
  .object({
    name: trimmedString(100),
    description: trimmedString(2000).optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .strip();

export const updateServiceSchema = z
  .object({
    name: trimmedString(100).optional(),
    description: trimmedString(2000).optional(),
    active: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .strip();

export const reorderServicesSchema = z
  .object({
    orderedIds: z.array(z.string()).min(1),
  })
  .strip();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ReorderServicesInput = z.infer<typeof reorderServicesSchema>;
