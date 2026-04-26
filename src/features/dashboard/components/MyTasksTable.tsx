import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User } from '@/features/auth';
import { AllProjectTable } from '@/features/projects';

import { myTasksColumns } from './MyTasksColumns';

interface MyTasksTableProps {
  user?: User;
}

export function MyTasksTable({ user }: MyTasksTableProps) {
  const [activeTab, setActiveTab] = useState('all');
  const columns = myTasksColumns({ user });

  const getFilters = () => {
    const baseFilters = { myTasks: true };

    switch (activeTab) {
      case 'all':
        return baseFilters;
      case 'in-progress-step-1':
        return { ...baseFilters, status: ['IN_PROGRESS'] };
      case 'in-progress-not-1':
        return { ...baseFilters, status: ['IN_PROGRESS'] };
      case 'in-progress-edit':
        return { ...baseFilters, status: ['IN_PROGRESS'] };
      case 'urgent':
        return { ...baseFilters, urgentStatus: ['URGENT'] };
      case 'very-urgent':
        return { ...baseFilters, urgentStatus: ['VERY_URGENT'] };
      case 'super-urgent':
        return { ...baseFilters, urgentStatus: ['SUPER_URGENT'] };
      default:
        return baseFilters;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h2-topic">งานของฉัน</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="*:normal max-w-full justify-start overflow-x-auto *:flex-none **:text-sm **:before:hidden">
          <TabsTrigger value="all" className="normal-b gap-2">
            ทั้งหมด <Badge variant="info">1</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress-step-1" className="normal-b gap-2">
            งานยังไม่เริ่ม <Badge variant="info">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress-not-1" className="normal-b gap-2">
            กำลังดำเนินการ <Badge variant="info">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress-edit" className="normal-b gap-2">
            รอแก้ไข <Badge variant="info">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent" className="normal-b gap-2">
            งานด่วน <Badge variant="destructive">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="very-urgent" className="normal-b gap-2">
            งานด่วนที่สุด <Badge variant="info">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="super-urgent" className="normal-b gap-2">
            งานด่วนพิเศษ <Badge variant="success">2</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <AllProjectTable filters={getFilters()} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
