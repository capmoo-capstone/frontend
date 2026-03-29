import { useMutation } from '@tanstack/react-query';

import { useUnits } from '@/features/organization';

interface UpdateUnitRepresentativeInput {
  departmentId: string;
  unitId: string;
  userId: string;
  userName: string;
}

export function useDepartmentUnits(departmentId: string) {
  return useUnits(departmentId);
}

export function useUpdateUnitRepresentative() {
  return useMutation({
    mutationFn: async (_payload: UpdateUnitRepresentativeInput) => {
      // TODO (BACKEND): Connect this UI action to the corresponding API endpoint for Update Unit Representative.
      throw new Error('BACKEND_ENDPOINT_NOT_READY');
    },
  });
}
