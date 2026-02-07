import { useState } from 'react';

import { Delete, Funnel, Import, Inbox, TextSearch } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

import { AllProjectTable } from '@/components/project-tables/all-project';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { ProjectFilterCard } from './components/project-list/ProjectFilterCard';
import { SearchInput } from './components/project-list/Search';
import { StatusCard } from './components/project-list/StatusCard';

export default function ProjectListPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div className="relative space-y-6">
      <h1 className="h1-topic">โครงการทั้งหมด</h1>
      <div className="flex items-end justify-end gap-2">
        <SearchInput />
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
          <ProjectFilterCard />

          <div className="col-span-4 mt-4 flex justify-end gap-3">
            <Button variant="brand">
              <TextSearch /> ค้นหาขั้นสูง
            </Button>
            <Button variant="outline">
              <Delete /> ล้างค่าตัวกรอง
            </Button>
          </div>
        </div>
      )}
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

      <AllProjectTable />
      {/* <PaginationSection /> */}
    </div>
  );
}
