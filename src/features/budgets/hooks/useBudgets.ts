import { useQuery } from '@tanstack/react-query';

// import axios from '@/lib/axios';

const MOCK_BUDGET_PLANS = [
  { id: 'BP001', name: 'เก้าอี้สำนักงาน สำนักบริหารวิจัย', amount: 240000 },
  { id: 'BP002', name: 'ถังดักไขมัน ฝ่ายทุนการศึกษา', amount: 66400 },
];

export function useBudgetPlans(unitId: string, fiscalYear: string) {
  return useQuery({
    queryKey: ['budget-plans', unitId, fiscalYear],
    queryFn: async () => {
      // const { data } = await axios.get(`/api/budget-plans?unit_id=${unitId}&fiscal_year=${fiscalYear}`);
      // return data;
      return MOCK_BUDGET_PLANS;
    },
    enabled: !!unitId && !!fiscalYear,
  });
}
