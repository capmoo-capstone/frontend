import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getBudgetPlans,
  importBudgetPlans,
  linkBudgetPlanToProject,
  removeBudgetPlan,
} from '../api';
import type { ImportBudgetPlanPayload } from '../types';

export const BUDGET_QUERY_KEYS = {
  all: ['budget-plans'] as const,
  byDepartmentAndYear: (departmentId: string, fiscalYear: string) =>
    ['budget-plans', departmentId, fiscalYear] as const,
};

export function useBudgetPlans(departmentId: string, fiscalYear: string) {
  return useQuery({
    queryKey: BUDGET_QUERY_KEYS.byDepartmentAndYear(departmentId, fiscalYear),
    queryFn: () => getBudgetPlans(departmentId, fiscalYear),
    enabled: Boolean(departmentId) && Boolean(fiscalYear),
  });
}

export function useImportBudgetPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportBudgetPlanPayload) => importBudgetPlans(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEYS.all });
    },
  });
}

export function useLinkBudgetPlanToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      linkBudgetPlanToProject(id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEYS.all });
    },
  });
}

export function useDeleteBudgetPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeBudgetPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEYS.all });
    },
  });
}
