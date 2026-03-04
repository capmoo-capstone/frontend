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
  fiscal_year: z.string(),
  budget_plan_ids: z.array(z.string()),
});

export type ProjectImportPayload = z.infer<typeof ProjectImportSchema>;

export interface EditableImportRow extends Partial<ProjectImportPayload> {
  _rowId: string;
  delivery_date_str?: string; // เก็บค่า string สำหรับ input type date
  isValid?: boolean;
  errors?: Record<string, string>;
}

export const MOCK_BUDGET_PLANS = [
  { id: 'BP001', name: 'กิจกรรม ก (ศูนย์ A)', amount: 500000 },
  { id: 'BP002', name: 'กิจกรรม ข (ศูนย์ B)', amount: 300000 },
];
