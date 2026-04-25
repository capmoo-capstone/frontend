import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { OPS_DEPT_ID } from '@/lib/constants';

import {
  addDelegation,
  cancelDelegation,
  getActiveDelegationByUnit,
  getDelegationById,
  getUserById,
  getUsers,
  getUsersForSelection,
  removeUser,
  updateSupplyRole,
  updateUserRole,
  updateUsersInUnit,
} from '../api';
import type { GetUsersParams, GetUsersSelectionParams, UserRole } from '../types';
import { userKeys } from './queryKeys';

export const useUsers = ({ page = 1, limit = 10 }: GetUsersParams) => {
  return useQuery({
    queryKey: userKeys.list({ page, limit }),
    queryFn: () => getUsers({ page, limit }),

    placeholderData: keepPreviousData,
  });
};

export const useUsersForSelection = (
  { unitId, deptId }: GetUsersSelectionParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: userKeys.selection({ unitId, deptId }),
    queryFn: () => {
      if (unitId) return getUsersForSelection({ unitId });
      if (deptId) return getUsersForSelection({ deptId });
      throw new Error('Either unitId or deptId is required');
    },
    enabled: (options?.enabled ?? true) && (!!unitId || !!deptId),
  });
};

export const useUsersForUnitsSelection = (unitIds: string[]) => {
  return useQueries({
    queries: unitIds.map((unitId) => ({
      queryKey: userKeys.unitSelection(unitId),
      queryFn: () => getUsersForSelection({ unitId }),
      enabled: !!unitId,
    })),
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => {
      if (userId) return getUserById(userId);
      throw new Error('userId is required');
    },
    enabled: !!userId,
  });
};

export const useUpdateUsersInUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { unitId: string; newUserIds: string[]; removeUserIds: string[] }) =>
      updateUsersInUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.selections() });
    },
  });
};

export const useUpdateSupplyRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { role: UserRole; newUserIds: string[]; removeUserIds: string[] }) =>
      updateSupplyRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.deptSelection(OPS_DEPT_ID),
      });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      role: UserRole;
      newUserIds: string[];
      removeUserIds: string[];
      deptId?: string;
      unitId?: string;
    }) => updateUserRole(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.selection({ deptId: variables.deptId }),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.selection({ unitId: variables.unitId }),
      });
    },
    onError: (error) => {
      throw new Error('Failed to update user role:' + error.message);
    },
  });
};

export const useRemoveUser = () => {
  return useMutation({
    mutationFn: (data: { userId: string }) => removeUser(data.userId),
  });
};

export const useAddDelegation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      delegatorId: string;
      delegateeId: string;
      startDate: Date;
      endDate?: Date;
    }) =>
      addDelegation({
        delegator_id: data.delegatorId,
        delegatee_id: data.delegateeId,
        start_date: data.startDate,
        end_date: data.endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.delegations() });
    },
  });
};

export const useUserDelegationDetail = (delegationId: string) => {
  return useQuery({
    queryKey: userKeys.delegation(delegationId),
    queryFn: () => {
      if (delegationId) {
        return getDelegationById(delegationId);
      }
      throw new Error('delegationId is required');
    },
    enabled: !!delegationId,
  });
};

export const useCancelDelegation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { delegationId: string }) => cancelDelegation(data.delegationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.delegations() });
    },
  });
};

export const useActiveDelegationByUnit = (unitIds: string[]) => {
  return useQueries({
    queries: unitIds.map((unitId) => ({
      queryKey: userKeys.activeDelegationByUnit(unitId),
      queryFn: () => {
        if (unitId) {
          return getActiveDelegationByUnit(unitId);
        }
        throw new Error('unitId is required');
      },
      enabled: !!unitId,
    })),
  });
};
