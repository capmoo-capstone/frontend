import { useMemo } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  AllProjectTable,
  ProjectFilterPanel,
  ProjectStats,
  ProjectToolbar,
  useProjectFilters,
} from '@/features/projects';

export default function ProjectListPage() {
  const { user } = useAuth();

  const {
    filters,
    tempFilters,
    setTempFilters,
    searchQuery,
    setSearchQuery,
    isFilterOpen,
    setIsFilterOpen,
    handleGlobalSearch,
    handleApplyFilter,
    handleResetFilter,
  } = useProjectFilters();

  const finalFilters = useMemo(() => {
    const appliedFilters = { ...filters };

    if (user?.department?.name !== 'procurement' && user?.department?.id) {
      appliedFilters.departments = [user.department.id];
    }

    return appliedFilters;
  }, [filters, user]);

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">โครงการทั้งหมด</h1>
      </div>

      {/* Stats */}
      <ProjectStats />

      {/* Toolbar */}
      <ProjectToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleGlobalSearch}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
      />

      {/* Filter Panel */}
      {isFilterOpen && (
        <ProjectFilterPanel
          filters={tempFilters}
          setFilters={setTempFilters}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      )}

      {/* Data Table */}
      <AllProjectTable filters={finalFilters} />
    </div>
  );
}
