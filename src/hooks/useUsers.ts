import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers, getUsersForSelection } from '@/api/user.api';

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
  | { unitId: string; departmentId?: never }
  | { unitId?: never; departmentId: string };

export const useUsersForSelection = ({ unitId, departmentId }: UseUsersSelectionProps) => {
  return useQuery({
    queryKey: ['users', 'selection', { unitId, departmentId }],
    queryFn: () => {
      if (unitId) return getUsersForSelection({ unit_id: unitId });
      if (departmentId)
        return getUsersForSelection({
          department_id: departmentId,
        });
      throw new Error('Either unitId or departmentId is required');
    },
    enabled: !!unitId || !!departmentId,
  });
};
