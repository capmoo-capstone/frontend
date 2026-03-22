import { z } from 'zod';

const UnitApiItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  dept_id: z.string().optional(),
  type: z.array(z.string()).optional(),
});

export type UnitApiItem = z.infer<typeof UnitApiItemSchema>;

const UnitRepresentativeSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .nullable();

export type UnitRepresentative = z.infer<typeof UnitRepresentativeSchema>;

const DepartmentApiItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  units: z.array(UnitApiItemSchema).optional(),
});

export type DepartmentApiItem = z.infer<typeof DepartmentApiItemSchema>;

export const DepartmentsApiResponseSchema = z.object({
  total: z.number(),
  data: z.array(DepartmentApiItemSchema),
});

export type DepartmentsApiResponse = z.infer<typeof DepartmentsApiResponseSchema>;

export const DepartmentDetailApiResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  units: z.array(UnitApiItemSchema).optional(),
});

export type DepartmentDetailApiResponse = z.infer<typeof DepartmentDetailApiResponseSchema>;

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type DepartmentItem = z.infer<typeof DepartmentSchema>;

export const DepartmentWithCodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export type Department = z.infer<typeof DepartmentWithCodeSchema>;
export const DepartmentsWithCodeSchema = z.array(DepartmentWithCodeSchema);

export const PaginatedUnitsApiResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  data: z.array(UnitApiItemSchema),
});

export type PaginatedUnitsApiResponse = z.infer<typeof PaginatedUnitsApiResponseSchema>;

export const UnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  dept_id: z.string().optional(),
  type: z.array(z.string()).optional(),
  representative: UnitRepresentativeSchema.optional(),
});

export type UnitItem = z.infer<typeof UnitSchema>;

export const CreateDepartmentPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type CreateDepartmentPayload = z.infer<typeof CreateDepartmentPayloadSchema>;

export const UpdateDepartmentPayloadSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

export type UpdateDepartmentPayload = z.infer<typeof UpdateDepartmentPayloadSchema>;

export const CreateUnitPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  dept_id: z.string().uuid(),
  type: z.array(z.string()).optional(),
});

export type CreateUnitPayload = z.infer<typeof CreateUnitPayloadSchema>;

export const UpdateUnitPayloadSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  dept_id: z.string().uuid().optional(),
  type: z.array(z.string()).optional(),
});

export type UpdateUnitPayload = z.infer<typeof UpdateUnitPayloadSchema>;

export const UnitListParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

export type UnitListParams = z.infer<typeof UnitListParamsSchema>;
