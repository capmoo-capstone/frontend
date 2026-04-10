import { z } from 'zod';

import { RoleEnum } from '@/features/auth';

export const StaffWorkloadSchema = z.object({
  user_id: z.string(),
  full_name: z.string(),
  workload: z.number(),
});

export const UnitWorkloadSchema = z.object({
  unit_id: z.string(),
  unit_name: z.string(),
  staff: z.array(StaffWorkloadSchema),
});

export const WorkloadStatsResponseSchema = z.union([
  z.object({
    role: RoleEnum,
    units: z.array(UnitWorkloadSchema),
  }),
  z.object({
    role: RoleEnum,
    unit_id: z.string(),
    unit_name: z.string(),
    staff: z.array(StaffWorkloadSchema),
  }),
]);

export const SummaryResponseSchema = z.union([
  z.object({
    role: z.literal('SUPPLY'),
    total: z.number(),
    UNASSIGNED: z.number(),
    WAITING_ACCEPT: z.number(),
    IN_PROGRESS: z.number(),
    CLOSED: z.number(),
    CANCELLED: z.number(),
    URGENT: z.number(),
    SUPER_URGENT: z.number().default(0),
    VERY_URGENT: z.number(),
  }),
  z.object({
    role: z.literal('EXTERNAL'),
    total: z.number(),
    NOT_STARTED: z.number(),
    IN_PROGRESS: z.number(),
    CLOSED: z.number(),
    CANCELLED: z.number(),
    URGENT: z.number(),
    SUPER_URGENT: z.number().default(0),
    VERY_URGENT: z.number(),
  }),
]);

export type StaffWorkload = z.infer<typeof StaffWorkloadSchema>;
export type UnitWorkload = z.infer<typeof UnitWorkloadSchema>;
export type WorkloadStatsResponse = z.infer<typeof WorkloadStatsResponseSchema>;
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;
