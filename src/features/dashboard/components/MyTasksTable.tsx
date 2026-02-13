import { useState } from 'react';

import { AllProjectTable } from '@/components/projects';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User } from '@/types/auth';
import type { ProjectStatus } from '@/types/project';

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
      case 'in-progress':
        return { ...baseFilters, status: ['IN_PROGRESS' as ProjectStatus] };
      case 'urgent':
        return { ...baseFilters, urgentStatus: ['URGENT', 'VERY_URGENT'] };
      case 'request-edit':
        return { ...baseFilters, status: ['REQUEST_EDIT' as ProjectStatus] };
      case 'waiting-accept':
        return { ...baseFilters, status: ['WAITING_ACCEPT' as ProjectStatus] };
      case 'completed':
        return { ...baseFilters, status: ['CLOSED' as ProjectStatus] };
      case 'cancelled':
        return { ...baseFilters, status: ['CANCELLED' as ProjectStatus] };
      default:
        return baseFilters;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h2-topic">งานของฉัน</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="*:normal max-w-full justify-start overflow-x-auto *:flex-none **:text-sm **:before:hidden">
          <TabsTrigger value="all" className="normal gap-2">
            ทั้งหมด <Badge variant="info">1</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="normal gap-2">
            งานที่กำลังดำเนินการ <Badge variant="info">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent" className="normal gap-2">
            งานด่วน <Badge variant="info">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="request-edit" className="normal gap-2">
            งานที่รอการแก้ไข <Badge variant="destructive">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="waiting-accept" className="normal gap-2">
            งานที่รอการตอบรับ <Badge variant="info">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="normal gap-2">
            งานที่เสร็จสิ้น <Badge variant="success">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="normal gap-2">
            งานที่ถูกยกเลิก <Badge variant="destructive">2</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <AllProjectTable filters={getFilters()} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
