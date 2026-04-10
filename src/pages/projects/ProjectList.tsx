import { useNavigate } from 'react-router-dom';

import {
  AllProjectTable,
  ProjectFilterPanel,
  ProjectStats,
  ProjectToolbar,
  useProjectFilters,
} from '@/features/projects';
import { useProjectPermissions } from '@/features/projects/hooks/useProjectPermissions';

export default function ProjectListPage() {
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
  const { canImportProject } = useProjectPermissions();

  const navigate = useNavigate();

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
        onImport={() => {
          navigate('/app/project-import');
        }}
        canImportProject={canImportProject}
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
      <AllProjectTable filters={filters} />
    </div>
  );
}