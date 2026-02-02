import { z } from 'zod';

import { UnitResponsibleTypeEnum } from './project';

export const UnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  dept_id: z.string(),
  type: z.array(UnitResponsibleTypeEnum),
});

export type Unit = z.infer<typeof UnitSchema>;

export const UnitListSchema = z.array(UnitSchema);
