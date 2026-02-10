import z from 'zod';

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export type Department = z.infer<typeof DepartmentSchema>;
export const DepartmentsSchema = z.array(DepartmentSchema);
