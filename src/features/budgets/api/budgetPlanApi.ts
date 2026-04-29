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
const PAGE_FETCH_CONCURRENCY = 5;

interface BudgetPlanQueryParams {
  unitId?: string;
  fiscalYear?: string;
}

const fetchRemainingPages = async <T>(
  totalPages: number,
  fetchPage: (page: number) => Promise<{ data: T[] }>
): Promise<T[]> => {
  const rows: T[] = [];

  for (let pageStart = 2; pageStart <= totalPages; pageStart += PAGE_FETCH_CONCURRENCY) {
    const pageNumbers = Array.from(
      { length: Math.min(PAGE_FETCH_CONCURRENCY, totalPages - pageStart + 1) },
      (_, index) => pageStart + index
    );

    const batchResults = await Promise.all(pageNumbers.map((pageNumber) => fetchPage(pageNumber)));
    batchResults.forEach((pageResult) => {
      rows.push(...pageResult.data);
    });
  }

  return rows;
};

const normalizeBudgetPlan = (item: BudgetPlanBackend): BudgetPlan => {
  return BudgetPlanSchema.parse({
    id: item.id,
    budget_year: item.budget_year,
    unit_id: item.unit_id,
    activity_type: item.activity_type,
    activity_type_name: item.activity_type_name,
    description: item.description ?? item.activity_type_name,
    budget_amount: item.budget_amount,
    project_id: item.project_id ?? null,
  });
};

const fetchBudgetPlanPage = async (
  page: number,
  limit: number,
  query: BudgetPlanQueryParams = {}
) => {
  const { data } = await api.get('/budget-plans', {
    params: {
      page,
      limit,
      ...(query.unitId ? { unit_id: query.unitId } : {}),
      ...(query.fiscalYear ? { fiscal_year: query.fiscalYear } : {}),
    },
  });

  return BudgetPlanListResponseSchema.parse(data);
};

export async function getBudgetPlans(unitId: string, fiscalYear: string): Promise<BudgetPlan[]> {
  if (!unitId || !fiscalYear) {
    return [];
  }

  const firstPage = await fetchBudgetPlanPage(1, PAGE_LIMIT, { unitId, fiscalYear });
  const allRows = [...firstPage.data];

  if (firstPage.totalPages > 1) {
    const restRows = await fetchRemainingPages(firstPage.totalPages, (pageNumber) =>
      fetchBudgetPlanPage(pageNumber, PAGE_LIMIT, { unitId, fiscalYear })
    );
    allRows.push(...restRows);
  }

  return allRows
    .filter((item) => item.unit_id === unitId && item.budget_year === Number(fiscalYear))
    .map((item) => normalizeBudgetPlan(item));
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
  const encodedId = encodeURIComponent(id);
  const encodedProjectId = encodeURIComponent(projectId);
  const { data } = await api.patch(`/budget-plans/${encodedId}/projects/${encodedProjectId}`);

  return BudgetPlanProjectLinkResponseSchema.parse(data);
}

export async function removeBudgetPlan(id: string): Promise<void> {
  const encodedId = encodeURIComponent(id);
  await api.delete(`/budget-plans/${encodedId}`);
}
