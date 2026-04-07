import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';

import { useUnits } from '@/features/organization';
import { getRepresentative, updateRepresentative } from '@/features/users';

export function useDepartmentUnits(departmentId: string) {
  const { data: units } = useUnits(departmentId);
  const unitIds = units?.map((unit) => unit.id) ?? [];
  const representativesQuery = useRepresentative(unitIds);
  const isLoading = representativesQuery.some((query) => query.isLoading);
  const representativesByUnitId = new Map(
    unitIds.map((unitId, index) => [unitId, representativesQuery[index]] as const)
  );
  const unitsWithReps = units?.map((unit) => {
    const repQuery = representativesByUnitId.get(unit.id);
    return {
      ...unit,
      representative: repQuery?.data
        ? {
            id: repQuery.data.id,
            name: repQuery.data.full_name,
          }
        : null,
    };
  });
  return { data: unitsWithReps, isLoading };
}

export const useRepresentative = (unitIds: string[]) => {
  return useQueries({
    queries: unitIds.map((id) => ({
      queryKey: ['representative', { id }],
      queryFn: () => {
        if (id) return getRepresentative(id);
        throw new Error('unitId is required');
      },
      enabled: !!id,
    })),
  });
};

export const useUpdateRepresentative = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; unitId: string }) =>
      updateRepresentative(data.userId, data.unitId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['representative', { id: variables.unitId }],
      });
    },
    onError: (error) => {
      throw new Error('Failed to update representative for unit:' + error.message);
    },
  });
};
