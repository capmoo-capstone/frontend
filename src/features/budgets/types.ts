import { z } from 'zod';

export const CreateBudgetPlanSchema = z.object({
  fiscal_year: z.string().min(1, 'กรุณากรอกปีงบประมาณ'),
  cost_center: z.string().min(1, 'กรุณากรอกศูนย์ต้นทุน'),

  department_id: z.string().min(1, 'กรุณาเลือกหน่วยงาน'),
  unit_id: z.string().min(1, 'กรุณาเลือกฝ่าย'),

  activity_type: z.string().min(1, 'กรุณากรอกประเภทกิจกรรม'),
  activity_name: z.string().min(1, 'กรุณากรอกชื่อประเภทกิจกรรม'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('วงเงินงบประมาณต้องมากกว่า 0'),
});

export const BudgetPlanSchema = CreateBudgetPlanSchema.extend({
  id: z.string(),

  department_name: z.string(),
  unit_name: z.string(),
});

export type CreateBudgetPlanPayload = z.infer<typeof CreateBudgetPlanSchema>;
export type BudgetPlan = z.infer<typeof BudgetPlanSchema>;
