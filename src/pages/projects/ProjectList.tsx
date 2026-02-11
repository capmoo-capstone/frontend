import { useMemo } from 'react';

import { Funnel, Import, Search } from 'lucide-react';

import { AllProjectTable, ProjectFilterPanel, ProjectStats } from '@/components/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useProjectFilters } from '@/hooks/useProjectFilters';

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
      <div className="flex items-end justify-end gap-2">
        <div className="bg-background relative rounded-lg">
          <Input
            className="normal pr-10"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
          />
          <Button
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleGlobalSearch}
          >
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </Button>
        </div>
        <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Funnel /> ค้นหาขั้นสูง
        </Button>
        <Button variant="brand">
          <Import />
          นำเข้าโครงการ
        </Button>
      </div>

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
