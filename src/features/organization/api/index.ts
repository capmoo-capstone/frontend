import api from '@/lib/axios';

import { type DepartmentItem, DepartmentsApiResponseSchema, type UnitItem } from '../types';

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

  const { data } = await api.get('/departments');
  const parsed = DepartmentsApiResponseSchema.parse(data);
  const department = parsed.data.find((item) => item.id === departmentId);

  return (department?.units ?? []).map((unit) => ({
    id: unit.id,
    name: unit.name,
    representative: null,
  }));
};
