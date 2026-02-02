import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addMemberToUnit, getUnits } from '@/api/unit.api';

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });
};

export const useAddUnitMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitId, userId }: { unitId: string; userId: string }) =>
      addMemberToUnit(unitId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'selection'],
      });
      queryClient.invalidateQueries({
        queryKey: ['units'],
      });
    },
  });
};
