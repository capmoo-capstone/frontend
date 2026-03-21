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
    onSuccess: (payload) => {
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

      // Note: Once a real backend API is implemented for updating unit representatives,
      // replace the mutationFn to call it and move the invalidateQueries back here.
    },
  });
}
