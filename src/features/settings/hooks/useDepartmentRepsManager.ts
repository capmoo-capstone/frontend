import { useMemo, useState } from 'react';

import { useDepartments } from '@/features/organization';
import { OPS_DEPT_ID } from '@/lib/constants';

interface DepartmentItem {
  id: string;
  name: string;
}

export function useDepartmentRepsManager() {
  const { data: departments, isLoading } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
    // remove operation department from the list
    const nonOperationDepartments = (departments ?? []).filter((dept) => dept.id !== OPS_DEPT_ID);

    // TODO (BACKEND MIGRATION): Department filtering and search ranking should be handled by query params in the backend for scalability.
    if (!searchTerm.trim()) return nonOperationDepartments;

    const keyword = searchTerm.trim().toLowerCase();
    return nonOperationDepartments.filter((department: DepartmentItem) =>
      department.name.toLowerCase().includes(keyword)
    );
  }, [departments, searchTerm]);

  return {
    isLoading,
    searchTerm,
    setSearchTerm,
    filteredDepartments,
  };
}
