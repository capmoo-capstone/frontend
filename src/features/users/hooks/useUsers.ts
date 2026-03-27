import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addUsersToUnit, getUserById, getUsers, getUsersForSelection } from '../api';
import type { GetUsersParams, GetUsersSelectionParams } from '../types';

export const useUsers = ({ page = 1, limit = 10 }: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => getUsers({ page, limit }),

    placeholderData: keepPreviousData,
  });
};

export const useUsersForSelection = ({ unitId, deptId }: GetUsersSelectionParams) => {
  return useQuery({
    queryKey: ['users', 'selection', { unitId, deptId }],
    queryFn: () => {
      if (unitId) return getUsersForSelection({ unitId });
      if (deptId) return getUsersForSelection({ deptId });
      throw new Error('Either unitId or deptId is required');
    },
    enabled: !!unitId || !!deptId,
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

    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ['users'],
    //   });
    // }
  });
};
