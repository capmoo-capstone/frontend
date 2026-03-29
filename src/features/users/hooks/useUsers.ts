import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers, getUsersForSelection } from '../api';
import type { GetUsersParams, GetUsersSelectionParams } from '../types';

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
