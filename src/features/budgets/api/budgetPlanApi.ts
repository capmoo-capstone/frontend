import { z } from 'zod';

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
const UNIT_DEPARTMENT_MAP_TTL_MS = 5 * 60 * 1000;

let unitDepartmentMapPromise: Promise<Map<string, string>> | null = null;
let unitDepartmentMapCachedAt = 0;

interface BudgetPlanQueryParams {
  departmentId?: string;
  fiscalYear?: string;
}

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

const buildUnitDepartmentMap = async (): Promise<Map<string, string>> => {
  const firstPage = await fetchUnitPage(1, PAGE_LIMIT);
  const allRows = [...firstPage.data];

  if (firstPage.totalPages > 1) {
    const restRows = await fetchRemainingPages(firstPage.totalPages, (pageNumber) =>
      fetchUnitPage(pageNumber, PAGE_LIMIT)
    );
    allRows.push(...restRows);
  }

  return new Map(
    allRows.filter((unit) => Boolean(unit.dept_id)).map((unit) => [unit.id, unit.dept_id as string])
  );
};

const getUnitDepartmentMap = async (): Promise<Map<string, string>> => {
  const isCacheValid =
    unitDepartmentMapPromise !== null &&
    Date.now() - unitDepartmentMapCachedAt < UNIT_DEPARTMENT_MAP_TTL_MS;

  if (isCacheValid && unitDepartmentMapPromise) {
    return unitDepartmentMapPromise;
  }

  unitDepartmentMapCachedAt = Date.now();
  unitDepartmentMapPromise = buildUnitDepartmentMap().catch((error: unknown) => {
    unitDepartmentMapPromise = null;
    unitDepartmentMapCachedAt = 0;
    throw error;
  });

  return unitDepartmentMapPromise;
};

const normalizeBudgetPlan = (item: BudgetPlanBackend, departmentId: string): BudgetPlan => {
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

const fetchBudgetPlanPage = async (
  page: number,
  limit: number,
  query: BudgetPlanQueryParams = {}
) => {
  const { data } = await api.get('/budget-plans', {
    params: {
      page,
      limit,
      ...(query.departmentId ? { department_id: query.departmentId } : {}),
      ...(query.fiscalYear ? { fiscal_year: query.fiscalYear } : {}),
    },
  });

  return BudgetPlanListResponseSchema.parse(data);
};

export async function getBudgetPlans(
  departmentId: string,
  fiscalYear: string
): Promise<BudgetPlan[]> {
  if (!departmentId || !fiscalYear) {
    return [];
  }

  const [firstPage, unitDepartmentMap] = await Promise.all([
    fetchBudgetPlanPage(1, PAGE_LIMIT, { departmentId, fiscalYear }),
    getUnitDepartmentMap(),
  ]);
  const allRows = [...firstPage.data];

  if (firstPage.totalPages > 1) {
    const restRows = await fetchRemainingPages(firstPage.totalPages, (pageNumber) =>
      fetchBudgetPlanPage(pageNumber, PAGE_LIMIT, { departmentId, fiscalYear })
    );
    allRows.push(...restRows);
  }

  return allRows
    .filter(
      (item) =>
        unitDepartmentMap.get(item.unit_id) === departmentId && item.budget_year === fiscalYear
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
  const encodedId = encodeURIComponent(id);
  const encodedProjectId = encodeURIComponent(projectId);
  const { data } = await api.patch(`/budget-plans/${encodedId}/project/${encodedProjectId}`);

  return BudgetPlanProjectLinkResponseSchema.parse(data);
}

export async function removeBudgetPlan(id: string): Promise<void> {
  const encodedId = encodeURIComponent(id);
  await api.delete(`/budget-plans/${encodedId}`);
}
