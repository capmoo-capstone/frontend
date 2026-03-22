import { z } from 'zod';

import { type BudgetPlan, BudgetPlanSchema } from '../types';

// import axios from '@/lib/axios';

const MOCK_BUDGET_PLANS: BudgetPlan[] = [
  {
    id: '1',
    fiscal_year: '2024',
    cost_center: 'CC001',
    department_id: 'D001',
    unit_id: 'U001',
    activity_type: 'กิจกรรม A',
    activity_name: 'กิจกรรมส่งเสริมการขาย',
    description: 'รายละเอียดกิจกรรมส่งเสริมการขาย',
    amount: 100000,
    department_name: 'ฝ่ายการตลาด',
    unit_name: 'หน่วยงานส่งเสริมการขาย',
  },
  {
    id: '2',
    fiscal_year: '2024',
    cost_center: 'CC002',
    department_id: 'D002',
    unit_id: 'U002',
    activity_type: 'กิจกรรม B',
    activity_name: 'กิจกรรมฝึกอบรม',
    description: 'รายละเอียดกิจกรรมฝึกอบรม',
    amount: 50000,
    department_name: 'ฝ่ายทรัพยากรบุคคล',
    unit_name: 'หน่วยงานฝึกอบรม',
  },
  {
    id: '3',
    fiscal_year: '2024',
    cost_center: 'CC003',
    department_id: 'D003',
    unit_id: 'U003',
    activity_type: 'กิจกรรม C',
    activity_name: 'กิจกรรมวิจัยและพัฒนา',
    description: 'รายละเอียดกิจกรรมวิจัยและพัฒนา',
    amount: 200000,
    department_name: 'ฝ่ายวิจัยและพัฒนา',
    unit_name: 'หน่วยงานวิจัยและพัฒนา',
  },
];

const BudgetPlanListSchema = z.array(BudgetPlanSchema);

export async function getBudgetPlans(unitId: string, fiscalYear: string): Promise<BudgetPlan[]> {
  // const { data } = await axios.get('/api/budget-plans', {
  //   params: { unit_id: unitId, fiscal_year: fiscalYear },
  // });
  // return BudgetPlanListSchema.parse(data);

  const filteredPlans = MOCK_BUDGET_PLANS.filter(
    (plan) => plan.unit_id === unitId && plan.fiscal_year === fiscalYear
  );

  return BudgetPlanListSchema.parse(filteredPlans);
}
