import api from '@/lib/axios';
import { z } from 'zod';

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

const UnitListResponseSchema = z.object({
  totalPages: z.number(),
  data: z.array(
    z.object({
      id: z.string(),
      dept_id: z.string().optional(),
    })
  ),
});

const fetchUnitPage = async (page: number, limit: number) => {
  const { data } = await api.get('/units', {
    params: { page, limit },
  });

  return UnitListResponseSchema.parse(data);
};

const getUnitDepartmentMap = async (): Promise<Map<string, string>> => {
  const firstPage = await fetchUnitPage(1, PAGE_LIMIT);
  const allRows = [...firstPage.data];

  if (firstPage.totalPages > 1) {
    const restPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
        fetchUnitPage(index + 2, PAGE_LIMIT)
      )
    );

    restPages.forEach((pageResult) => {
      allRows.push(...pageResult.data);
    });
  }

  return new Map(
    allRows
      .filter((unit) => Boolean(unit.dept_id))
      .map((unit) => [unit.id, unit.dept_id as string])
  );
};

const normalizeBudgetPlan = (
  item: BudgetPlanBackend,
  departmentId: string
): BudgetPlan => {
  return BudgetPlanSchema.parse({
    id: item.id,
    fiscal_year: item.budget_year,
    cost_center: item.unit_no,
    department_id: departmentId,
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
  const [firstPage, unitDepartmentMap] = await Promise.all([
    fetchBudgetPlanPage(1, PAGE_LIMIT),
    getUnitDepartmentMap(),
  ]);
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
    .filter(
      (item) =>
        unitDepartmentMap.get(item.unit_id) === departmentId &&
        item.budget_year === fiscalYear
    )
    .map((item) => normalizeBudgetPlan(item, departmentId));
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
