import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useDepartments, useUnits } from '@/features/organization';

interface UpdateUnitRepresentativeInput {
  departmentId: string;
  unitId: string;
  userId: string;
  userName: string;
}

export function useDepartmentRepData() {
  return useDepartments();
}

export function useDepartmentUnits(departmentId: string) {
  return useUnits(departmentId);
}

export function useUpdateUnitRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUnitRepresentativeInput) => {
      return payload;
    },
    onSuccess: async (payload) => {
      queryClient.setQueryData(
        ['units', payload.departmentId],
        (
          oldData:
            | Array<{
                id: string;
                name: string;
                representative?: { id: string; name: string } | null;
              }>
            | undefined
        ) => {
          if (!oldData) return oldData;

          return oldData.map((unit) =>
            unit.id === payload.unitId
              ? {
                  ...unit,
                  representative: {
                    id: payload.userId,
                    name: payload.userName,
                  },
                }
              : unit
          );
        }
      );

      await queryClient.invalidateQueries({
        queryKey: ['units', payload.departmentId],
      });
    },
  });
}
