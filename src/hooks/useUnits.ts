import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addMemberToUnit, getUnits, updateUnit } from '@/api/unit.api';
import type { UnitResponsibleType } from '@/types/project';

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

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      unitId,
      updateData,
    }: {
      unitId: string;
      updateData: Partial<{
        name: string;
        type: UnitResponsibleType[];
      }>;
    }) => updateUnit(unitId, updateData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['units'],
      });
    },
  });
};
