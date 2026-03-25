import { z } from 'zod';

export type ImportMode = 'none' | 'lesspaper' | 'fiori' | 'manual';

export const PROCUREMENT_MIN_DAYS: Record<string, number> = {
  LT100K: 15,
  LT500K: 30,
  MT500K: 45,
  SELECTION: 60,
  EBIDDING: 90,
};

export const ProjectImportSchema = z.object({
  pr_no: z.string().optional(),
  lesspaper_no: z.string().optional(),
  title: z.string().min(1, 'กรุณาระบุชื่อโครงการ'),
  description: z.string().min(1, 'กรุณาระบุรายละเอียดโครงการ'),
  procurement_type: z.string().min(1, 'กรุณาเลือกวิธีการจัดหา'),
  delivery_date: z
    .date({ message: 'กรุณาเลือกวันที่ส่งมอบ' })
    .refine((date) => date > new Date(), { message: 'กรุณาระบุวันที่ในอนาคต' })
    .optional(),
  budget: z.coerce.number().positive('วงเงินงบประมาณต้องมากกว่า 0'),
  department_id: z.string().min(1, 'กรุณาเลือกหน่วยงาน'),
  unit_id: z.string().min(1, 'กรุณาเลือกฝ่าย'),
  fiscal_year: z.string().min(1, 'กรุณาเลือกปีงบประมาณ'),
  budget_plan_ids: z.array(z.string()),
});

export type ProjectImportFormValues = z.input<typeof ProjectImportSchema>;
export type ProjectImportPayload = z.infer<typeof ProjectImportSchema>;

export const FioriImportSchema = ProjectImportSchema.omit({
  unit_id: true,
  budget_plan_ids: true,
  lesspaper_no: true,
});

export type FioriImportPayload = z.infer<typeof FioriImportSchema>;

export const LesspaperImportSchema = ProjectImportSchema.omit({
  unit_id: true,
  budget_plan_ids: true,
  lesspaper_no: true,
}).extend({
  lesspaper_no: z.string().min(1, 'กรุณาระบุเลขที่หนังสือ Lesspaper'),
});

export type LesspaperImportPayload = z.infer<typeof LesspaperImportSchema>;

export interface EditableImportRow extends Partial<ProjectImportPayload> {
  _rowId: string;
  delivery_date_str?: string;
  isValid?: boolean;
  errors?: Record<string, string>;
}
