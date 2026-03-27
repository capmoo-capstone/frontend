import { useMemo, useState } from 'react';

import { useDepartmentRepData } from './useDepartmentReps';

interface DepartmentItem {
  id: string;
  name: string;
}

export function useDepartmentRepsManager() {
  const { data: departments, isLoading } = useDepartmentRepData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
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
