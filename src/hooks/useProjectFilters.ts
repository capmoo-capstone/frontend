import { useState } from 'react';

import type { ProjectFilterParams } from '@/hooks/useProjects';

const INITIAL_FILTERS: ProjectFilterParams = {
  search: '',
  title: '',
  dateRange: undefined,
  fiscalYear: '',
  procurementType: [],
  status: [],
  urgentStatus: [],
  departments: [],
  myTasks: false,
};

export function useProjectFilters() {
  const [appliedFilters, setAppliedFilters] = useState<ProjectFilterParams>(INITIAL_FILTERS);

  const [tempFilters, setTempFilters] = useState<ProjectFilterParams>(INITIAL_FILTERS);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGlobalSearch = () => {
    const newFilters = { ...appliedFilters, search: searchQuery };
    setTempFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const handleApplyFilter = () => {
    setAppliedFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setSearchQuery('');
  };

  return {
    filters: appliedFilters,
    tempFilters,
    setTempFilters,
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    handleGlobalSearch,
    handleApplyFilter,
    handleResetFilter,
  };
}
