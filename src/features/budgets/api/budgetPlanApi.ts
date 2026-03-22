import api from '@/lib/axios';

import {
  type BudgetPlan,
  type BudgetPlanBackend,
  BudgetPlanListResponseSchema,
  type BudgetPlanProjectLinkResponse,
  BudgetPlanProjectLinkResponseSchema,
  BudgetPlanSchema,
  type ImportBudgetPlanPayload,
  ImportBudgetPlanPayloadSchema,
  type ImportBudgetPlanResponse,
  ImportBudgetPlanResponseSchema,
} from '../types';

const PAGE_LIMIT = 100;

const normalizeBudgetPlan = (item: BudgetPlanBackend): BudgetPlan => {
  return BudgetPlanSchema.parse({
    id: item.id,
    fiscal_year: item.budget_year,
    cost_center: item.cost_center_no,
    department_id: item.department_id,
    activity_type: item.activity_type,
    activity_name: item.activity_type_name,
    description: item.description ?? item.activity_type_name,
    amount: item.budget_amount,
    project_id: item.project_id ?? null,
  });
};

const fetchBudgetPlanPage = async (page: number, limit: number) => {
  const { data } = await api.get('/budget-plans', {
    params: { page, limit },
  });

  return BudgetPlanListResponseSchema.parse(data);
};

export async function getBudgetPlans(
  departmentId: string,
  fiscalYear: string
): Promise<BudgetPlan[]> {
  const firstPage = await fetchBudgetPlanPage(1, PAGE_LIMIT);
  const allRows = [...firstPage.data];

  if (firstPage.totalPages > 1) {
    const restPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
        fetchBudgetPlanPage(index + 2, PAGE_LIMIT)
      )
    );

    restPages.forEach((pageResult) => {
      allRows.push(...pageResult.data);
    });
  }

  return allRows
    .filter((item) => item.department_id === departmentId && item.budget_year === fiscalYear)
    .map(normalizeBudgetPlan);
}

export async function importBudgetPlans(
  payload: ImportBudgetPlanPayload
): Promise<ImportBudgetPlanResponse> {
  const validatedPayload = ImportBudgetPlanPayloadSchema.parse(payload);
  const { data } = await api.post('/budget-plans', validatedPayload);

  return ImportBudgetPlanResponseSchema.parse(data);
}

export async function linkBudgetPlanToProject(
  id: string,
  projectId: string
): Promise<BudgetPlanProjectLinkResponse> {
  const { data } = await api.patch(`/budget-plans/${id}/project/${projectId}`);

  return BudgetPlanProjectLinkResponseSchema.parse(data);
}

export async function removeBudgetPlan(id: string): Promise<void> {
  await api.delete(`/budget-plans/${id}`);
}
