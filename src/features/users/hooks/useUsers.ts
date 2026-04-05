import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  addDelegation,
  addRepresentativeToUnit,
  cancelDelegation,
  getDelegationById,
  getUserById,
  getUsers,
  getUsersForSelection,
  removeUser,
  updateUserRole,
  updateUsersInUnit,
} from '../api';
import type { GetUsersParams, GetUsersSelectionParams, UserRole } from '../types';

export const useUsers = ({ page = 1, limit = 10 }: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => getUsers({ page, limit }),

    placeholderData: keepPreviousData,
  });
};

export const useUsersForSelection = (
  { unitId, deptId }: GetUsersSelectionParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['users', 'selection', { unitId, deptId }],
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
      queryKey: ['users', 'selection', { unitId }],
      queryFn: () => getUsersForSelection({ unitId }),
      enabled: !!unitId,
    })),
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => {
      if (userId) return getUserById(userId);
      throw new Error('userId is required');
    },
    enabled: !!userId,
  });
};

export const useUpdateUsersInUnit = () => {
  return useMutation({
    mutationFn: (data: { unitId: string; newUserIds: string[]; removeUserIds: string[] }) =>
      updateUsersInUnit(data),
    onError: (error) => {
      throw new Error('Failed to update users in unit:' + error.message);
    },
  });
};

export const useUpdateUserRole = () => {
  return useMutation({
    mutationFn: (data: { userId: string; role: UserRole; deptId: string; unitId?: string }) =>
      updateUserRole(data),
    onError: (error) => {
      throw new Error('Failed to update user role:' + error.message);
    },
  });
};

export const useAddRepresentativeToUnit = () => {
  return useMutation({
    mutationFn: (data: { userId: string; unitId: string }) =>
      addRepresentativeToUnit(data.userId, data.unitId),
    onError: (error) => {
      throw new Error('Failed to add representative to unit:' + error.message);
    },
  });
};

export const useRemoveUser = () => {
  return useMutation({
    mutationFn: (data: { userId: string }) => removeUser(data.userId),
  });
};

export const useAddDelegation = () => {
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
  });
};

export const useUserDelegationDetail = (delegationId: string) => {
  return useQuery({
    queryKey: ['delegation', delegationId],
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
    onSuccess: (_, { delegationId }) => {
      queryClient.invalidateQueries({ queryKey: ['delegations', delegationId] });
    },
  });
};
