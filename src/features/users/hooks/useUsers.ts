import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addDelegation,
  addRepresentativeToUnit,
  addUsersToUnit,
  cancelDelegation,
  getDelegationById,
  getUserById,
  getUsers,
  getUsersForSelection,
  removeUser,
  updateUserRole,
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

export const useAddUserToUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { unitId: string; userId: string[] }) => addUsersToUnit(data),
    onError: (error) => {
      throw new Error('Failed to add users to unit:' + error.message);
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role: UserRole; deptId: string; unitId?: string }) =>
      updateUserRole(data),
    onError: (error) => {
      throw new Error('Failed to update user role:' + error.message);
    },
  });
};

export const useAddRepresentativeToUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; unitId: string }) =>
      addRepresentativeToUnit(data.userId, data.unitId),
    onError: (error) => {
      throw new Error('Failed to add representative to unit:' + error.message);
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string }) => removeUser(data.userId),
    onError: (error) => {
      throw new Error('Failed to remove user:' + error.message);
    },
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
    onError: (error) => {
      throw new Error('Failed to add delegation:' + error.message);
    },
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
    onError: (error) => {
      throw new Error('Failed to cancel delegation:' + error.message);
    },
    onSuccess: (_, { delegationId }) => {
      queryClient.invalidateQueries({ queryKey: ['delegations', delegationId] });
    },
  });
};
