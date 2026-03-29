import { useMemo, useState } from 'react';

import { useDepartments } from '@/features/organization';

interface DepartmentItem {
  id: string;
  name: string;
}

export function useDepartmentRepsManager() {
  const { data: departments, isLoading } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
    // TODO (BACKEND MIGRATION): Department filtering and search ranking should be handled by query params in the backend for scalability.
    if (!searchTerm.trim()) return departments ?? [];

    const keyword = searchTerm.trim().toLowerCase();
    return (departments ?? []).filter((department: DepartmentItem) =>
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
