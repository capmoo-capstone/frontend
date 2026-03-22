import { useQuery } from '@tanstack/react-query';

import { getBudgetPlans } from '../api';

export function useBudgetPlans(unitId: string, fiscalYear: string) {
  return useQuery({
    queryKey: ['budget-plans', unitId, fiscalYear],
    queryFn: () => getBudgetPlans(unitId, fiscalYear),
    enabled: Boolean(unitId) && Boolean(fiscalYear),
  });
}
