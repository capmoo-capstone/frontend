import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers, getUsersForSelection } from '@/features/auth';

interface UseUsersProps {
  page?: number;
  limit?: number;
}

export const useUsers = ({ page = 1, limit = 10 }: UseUsersProps) => {
  return useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => getUsers({ page, limit }),

    placeholderData: keepPreviousData,
  });
};

type UseUsersSelectionProps =
  | { unitId: string; deptId?: never }
  | { unitId?: never; deptId: string };

export const useUsersForSelection = ({ unitId, deptId }: UseUsersSelectionProps) => {
  return useQuery({
    queryKey: ['users', 'selection', { unitId, deptId }],
    queryFn: () => {
      if (unitId) return getUsersForSelection({ unitId });
      if (deptId)
        return getUsersForSelection({
          deptId,
        });
      throw new Error('Either unitId or deptId is required');
    },
    enabled: !!unitId || !!deptId,
  });
};
