import { z } from 'zod';

export const BudgetPlanSchema = z.object({
  id: z.string(),
  budget_year: z.string().min(1, 'กรุณากรอกปีงบประมาณ'),
  unit_id: z.string().min(1, 'กรุณาเลือกชื่อศูนย์ต้นทุน'),
  unit_no: z.string().min(1, 'กรุณากรอกศูนย์ต้นทุน'),
  activity_type: z.string().min(1, 'กรุณากรอกประเภทกิจกรรม'),
  activity_type_name: z.string().min(1, 'กรุณากรอกชื่อประเภทกิจกรรม'),
  description: z.string(),
  budget_amount: z.number().positive('วงเงินงบประมาณต้องมากกว่า 0'),
  project_id: z.string().nullable().optional(),
});

export type BudgetPlan = z.infer<typeof BudgetPlanSchema>;

export const BudgetPlanBackendSchema = z.object({
  id: z.string(),
  budget_year: z.number(),
  unit_id: z.string(),
  unit_no: z.string().optional(),
  activity_type: z.string(),
  activity_type_name: z.string(),
  description: z.string().nullable().optional(),
  budget_no: z.string().nullable().optional(),
  budget_name: z.string().nullable().optional(),
  budget_amount: z.coerce.number(),
  project_id: z.string().nullable().optional(),
  created_at: z.string(),
  created_by: z.string(),
});

export type BudgetPlanBackend = z.infer<typeof BudgetPlanBackendSchema>;

export const BudgetPlanListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  data: z.array(BudgetPlanBackendSchema),
});

export type BudgetPlanListResponse = z.infer<typeof BudgetPlanListResponseSchema>;

export const ImportBudgetPlanItemSchema = z.object({
  fiscal_year: z.string().min(1, 'กรุณากรอกปีงบประมาณ'),
  unit_no: z.string().min(1, 'กรุณากรอกเลขศูนย์ต้นทุน'),
  unit_id: z.string().min(1, 'กรุณาเลือกศูนย์ต้นทุน'),
  activity_type: z.string().min(1, 'กรุณากรอกประเภทกิจกรรม'),
  activity_type_name: z.string().min(1, 'กรุณากรอกชื่อประเภทกิจกรรม'),
  description: z.string().min(1, 'กรุณากรอกรายละเอียด'),
  budget_no: z.string().min(1, 'กรุณาเลือกเงินทุน'),
  budget_name: z.string().min(1, 'กรุณาเลือกชื่อเงินทุน'),
  amount: z.number().positive('วงเงินงบประมาณต้องมากกว่า 0'),
});

export type ImportBudgetPlanItem = z.infer<typeof ImportBudgetPlanItemSchema>;

export const ImportBudgetPlanPayloadSchema = z.array(ImportBudgetPlanItemSchema);

export type ImportBudgetPlanPayload = z.infer<typeof ImportBudgetPlanPayloadSchema>;

export const ImportBudgetPlanResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      activity_type_name: z.string(),
      budget_amount: z.coerce.number(),
    })
  ),
});

export type ImportBudgetPlanResponse = z.infer<typeof ImportBudgetPlanResponseSchema>;

const BudgetPlanProjectLinkItemSchema = z.object({
  id: z.string(),
  activity_type_name: z.string(),
  budget_amount: z.coerce.number(),
  project_id: z.string().nullable().optional(),
});

export const BudgetPlanProjectLinkResponseSchema = z
  .union([
    z.object({
      data: BudgetPlanProjectLinkItemSchema,
    }),
    BudgetPlanProjectLinkItemSchema,
  ])
  .transform((value) => ('data' in value ? value : { data: value }));

export type BudgetPlanProjectLinkResponse = z.infer<typeof BudgetPlanProjectLinkResponseSchema>;
