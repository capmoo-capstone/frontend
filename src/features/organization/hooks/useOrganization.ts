import { useQuery } from '@tanstack/react-query';

import { getDepartments, getUnitsByDepartment } from '../api';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
}

export function useUnits(departmentId: string) {
  return useQuery({
    queryKey: ['units', departmentId],
    queryFn: () => getUnitsByDepartment(departmentId),
    enabled: !!departmentId,
  });
}
