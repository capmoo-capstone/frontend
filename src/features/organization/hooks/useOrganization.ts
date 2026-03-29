import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDepartment,
  createUnit,
  deleteDepartment,
  deleteUnit,
  getDepartments,
  getUnitById,
  getUnits,
  getUnitsByDepartment,
  updateDepartment,
  updateUnit,
} from '../api';
import {
  type CreateDepartmentPayload,
  type CreateUnitPayload,
  type UnitListParams,
  type UpdateDepartmentPayload,
  type UpdateUnitPayload,
} from '../types';

const ORGANIZATION_QUERY_KEYS = {
  departments: ['departments'] as const,
  units: ['units'] as const,
  unitsByDepartment: (departmentId: string) => ['units', departmentId] as const,
  unitsList: (page: number, limit: number) => ['units', 'list', page, limit] as const,
};

export function useDepartments() {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.departments,
    queryFn: getDepartments,
  });
}

export function useUnits(departmentId: string) {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.unitsByDepartment(departmentId),
    queryFn: () => getUnitsByDepartment(departmentId),
    enabled: !!departmentId,
  });
}

export function useUnitsList({ page = 1, limit = 20 }: Partial<UnitListParams> = {}) {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.unitsList(page, limit),
    queryFn: () => getUnits({ page, limit }),
  });
}

export function useUnitDetailsByIds(unitIds: string[]) {
  return useQueries({
    queries: unitIds.map((unitId) => ({
      queryKey: ['units', 'detail', unitId],
      queryFn: () => getUnitById(unitId),
      enabled: !!unitId,
    })),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.departments });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDepartmentPayload) => updateDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.departments });
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.units });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.departments });
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.units });
    },
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUnitPayload) => createUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.units });
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUnitPayload) => updateUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.units });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitId: string) => deleteUnit(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.units });
    },
  });
}
