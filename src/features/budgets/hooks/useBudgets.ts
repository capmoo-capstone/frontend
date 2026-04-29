import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getBudgetPlans,
  importBudgetPlans,
  linkBudgetPlanToProject,
  removeBudgetPlan,
} from '../api';
import type { ImportBudgetPlanPayload } from '../types';
import { budgetKeys } from './queryKeys';

export function useBudgetPlans(unitId: string, fiscalYear: string) {
  return useQuery({
    queryKey: budgetKeys.byUnitAndYear(unitId, fiscalYear),
    queryFn: () => getBudgetPlans(unitId, fiscalYear),
    enabled: Boolean(unitId) && Boolean(fiscalYear),
  });
}

export function useImportBudgetPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportBudgetPlanPayload) => importBudgetPlans(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useLinkBudgetPlanToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      linkBudgetPlanToProject(id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useDeleteBudgetPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeBudgetPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}
