import { useMemo, useState } from 'react';

import { Delete, Funnel, Import, Inbox, Search, TextSearch } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

import { AllProjectTable } from '@/components/project-tables/all-project';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { type ProjectFilterParams } from '@/hooks/useProjects';

import { ProjectFilterCard } from './components/project-list/ProjectFilterCard';
import { StatusCard } from './components/project-list/StatusCard';

export default function ProjectListPage() {
  const { user } = useAuth();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [topSearch, setTopSearch] = useState('');

  const handleGlobalSearch = () => {
    const newFilters = { ...tempFilters, search: topSearch };
    setTempFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const initialFilters: ProjectFilterParams = {
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

  const [tempFilters, setTempFilters] = useState<ProjectFilterParams>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProjectFilterParams>(initialFilters);

  const handleApplyFilter = () => {
    setAppliedFilters(tempFilters);
  };

  const handleReset = () => {
    setTempFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const finalFilters = useMemo(() => {
    const filters = { ...appliedFilters };

    if (user?.department?.name !== 'procurement') {
      filters.departments = [user?.department?.id || ''];
    }

    return filters;
  }, [appliedFilters, user]);

  return (
    <div className="relative space-y-6">
      <h1 className="h1-topic">โครงการทั้งหมด</h1>
      <Card className="py-6">
        <div className="grid grid-cols-7 items-center">
          <div className="border-r">
            <StatusCard
              label="โครงการทั้งหมด"
              count={3156}
              icon={<Inbox />}
              iconColor="text-primary"
            />
          </div>

          <div className="border-r">
            <StatusCard
              label="ยังไม่ได้มอบหมาย"
              count={4}
              icon={<Inbox />}
              iconColor="text-primary/70"
            />
          </div>

          <div className="border-r">
            <StatusCard
              label="กำลังดำเนินการ"
              count={320}
              icon={<Inbox />}
              iconColor="text-warning"
            />
          </div>

          <div className="border-r">
            <StatusCard label="เสร็จสิ้น" count={2800} icon={<Inbox />} iconColor="text-success" />
          </div>

          <div className="border-r">
            <StatusCard label="ยกเลิก" count={32} icon={<Inbox />} iconColor="text-error" />
          </div>

          <div className="border-r">
            <StatusCard label="ด่วน" count={12} icon={<AlertTriangle />} iconColor="text-error" />
          </div>
          <div>
            <StatusCard
              label="ด่วนพิเศษ"
              count={12}
              icon={<AlertTriangle />}
              iconColor="text-error-dark"
            />
          </div>
        </div>
      </Card>
      <div className="flex items-end justify-end gap-2">
        <div className="bg-background relative rounded-lg">
          <Input
            className="normal pr-10"
            placeholder="ค้นหา"
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
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
      {isFilterOpen && (
        <div>
          <ProjectFilterCard filters={tempFilters} setFilters={setTempFilters} />

          <div className="col-span-4 mt-4 flex justify-end gap-3">
            <Button variant="brand" onClick={handleApplyFilter}>
              <TextSearch /> ค้นหาขั้นสูง
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <Delete /> ล้างค่าตัวกรอง
            </Button>
          </div>
        </div>
      )}
      <AllProjectTable filters={finalFilters} />
    </div>
  );
}
