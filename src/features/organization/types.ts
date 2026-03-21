import { z } from 'zod';

const UnitApiItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const DepartmentApiItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  units: z.array(UnitApiItemSchema).optional(),
});

export const DepartmentsApiResponseSchema = z.object({
  total: z.number(),
  data: z.array(DepartmentApiItemSchema),
});

export const DepartmentDetailApiResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  units: z.array(UnitApiItemSchema).optional(),
});

export type DepartmentApiItem = z.infer<typeof DepartmentApiItemSchema>;
export type UnitApiItem = z.infer<typeof UnitApiItemSchema>;
export type DepartmentsApiResponse = z.infer<typeof DepartmentsApiResponseSchema>;
export type DepartmentDetailApiResponse = z.infer<typeof DepartmentDetailApiResponseSchema>;

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type DepartmentItem = z.infer<typeof DepartmentSchema>;

export const UnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  representative: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
});

export type UnitItem = z.infer<typeof UnitSchema>;
