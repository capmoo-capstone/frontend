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
import { organizationKeys } from './queryKeys';

export function useDepartments() {
  return useQuery({
    queryKey: organizationKeys.departments,
    queryFn: getDepartments,
  });
}

export function useUnits(departmentId: string) {
  return useQuery({
    queryKey: organizationKeys.unitsByDepartment(departmentId),
    queryFn: () => getUnitsByDepartment(departmentId),
    enabled: !!departmentId,
  });
}

export function useUnitsList({ page = 1, limit = 20 }: Partial<UnitListParams> = {}) {
  return useQuery({
    queryKey: organizationKeys.unitsList(page, limit),
    queryFn: () => getUnits({ page, limit }),
  });
}

export function useUnitDetailsByIds(unitIds: string[]) {
  return useQueries({
    queries: unitIds.map((unitId) => ({
      queryKey: organizationKeys.unitDetail(unitId),
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
      queryClient.invalidateQueries({ queryKey: organizationKeys.departments });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDepartmentPayload) => updateDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.departments });
      queryClient.invalidateQueries({ queryKey: organizationKeys.units });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.departments });
      queryClient.invalidateQueries({ queryKey: organizationKeys.units });
    },
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUnitPayload) => createUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.units });
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUnitPayload) => updateUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.units });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitId: string) => deleteUnit(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.units });
    },
  });
}
