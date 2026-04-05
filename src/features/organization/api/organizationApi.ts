import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import api from '@/lib/axios';

import {
  type CreateDepartmentPayload,
  type CreateUnitPayload,
  DepartmentDetailApiResponseSchema,
  type DepartmentItem,
  DepartmentSchema,
  DepartmentsApiResponseSchema,
  PaginatedUnitsApiResponseSchema,
  type UnitItem,
  type UnitListParams,
  UnitSchema,
  type UpdateDepartmentPayload,
  type UpdateUnitPayload,
} from '../types';

export const getDepartments = async (): Promise<DepartmentItem[]> => {
  const { data } = await api.get('/departments');
  const parsed = DepartmentsApiResponseSchema.parse(data);

  return parsed.data.map((department) => ({
    id: department.id,
    name: department.name,
  }));
};

export const getUnitsByDepartment = async (departmentId: string): Promise<UnitItem[]> => {
  if (!departmentId) return [];

  const { data } = await api.get(`/departments/${encodeURIComponent(departmentId)}`);
  const department = DepartmentDetailApiResponseSchema.parse(data);

  return (department.units ?? []).map((unit) => ({
    id: unit.id,
    name: unit.name,
    representative: null,
  }));
};

export const getUnits = async ({ page = 1, limit = 20 }: Partial<UnitListParams> = {}) => {
  const { data } = await api.get('/units', {
    params: { page, limit },
  });

  const parsed = PaginatedUnitsApiResponseSchema.parse(data);

  return {
    ...parsed,
    data: parsed.data.filter((unit) => unit.dept_id !== SUPPLY_OPERATION_DEPARTMENT_ID),
  };
};

export const getUnitById = async (unitId: string): Promise<UnitItem> => {
  const { data } = await api.get(`/units/${encodeURIComponent(unitId)}`);

  return UnitSchema.parse({
    ...data,
    representative: null,
  });
};

export const createDepartment = async (payload: CreateDepartmentPayload) => {
  const { data } = await api.post('/departments/create', payload);
  return DepartmentSchema.parse(data);
};

export const updateDepartment = async (payload: UpdateDepartmentPayload) => {
  const { id, ...rest } = payload;
  const { data } = await api.patch(`/departments/${encodeURIComponent(id)}/update`, rest);
  return DepartmentSchema.parse(data);
};

export const deleteDepartment = async (departmentId: string): Promise<void> => {
  await api.delete(`/departments/${encodeURIComponent(departmentId)}`);
};

export const createUnit = async (payload: CreateUnitPayload) => {
  const { data } = await api.post('/units/create', payload);
  return UnitSchema.parse({
    ...data,
    representative: null,
  });
};

export const updateUnit = async (payload: UpdateUnitPayload) => {
  const { id, ...rest } = payload;
  const { data } = await api.patch(`/units/${encodeURIComponent(id)}/update`, rest);
  return UnitSchema.parse({
    ...data,
    representative: null,
  });
};

export const deleteUnit = async (unitId: string): Promise<void> => {
  await api.delete(`/units/${encodeURIComponent(unitId)}`);
};
