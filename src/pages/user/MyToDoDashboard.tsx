import { useState } from 'react';

import { AllProjectTable, ProjectStats } from '@/components/projects';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import type { ProjectStatus } from '@/types/project';

import { CalendarWidget } from './components/calendar-widget';
import { myTasksColumns } from './components/my-tasks-columns';
import { type NotificationItem, NotificationList } from './components/notification-list';

// Mock Data for Notifications
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'ASSIGNED',
    title: 'กรุณาแจกงานประจำวันที่ 12 ม.ค. 2569',
    description: 'คุณได้รับมอบหมายให้รับผิดชอบโครงการ จำนวน 5 โครงการ กรุณาตรวจสอบ',
    time: '13.39 น.',
    isNew: true,
  },
  {
    id: 2,
    type: 'ASSIGNED',
    title: 'ได้รับมอบหมายงานใหม่',
    description: 'คุณได้รับมอบหมายให้รับผิดชอบโครงการ จำนวน 5 โครงการ กรุณาตรวจสอบ',
    time: '13.39 น.',
  },
  {
    id: 3,
    type: 'APPROVED',
    title: 'อนุมัติขั้นตอนการดำเนินการ',
    description:
      'โครงการจัดซื้อพัสดุสำหรับคณะหมูกรอบ ได้รับการอนุมัติแล้ว พร้อมดำเนินการในขั้นตอนที่ 1',
    time: '10.39 น.',
  },
  {
    id: 4,
    type: 'COMPLETED',
    title: 'ปิดโครงการ',
    description: 'ขณะนี้โครงการ [ชื่อโครงการ] ได้ดำเนินการเสร็จสิ้นแล้ว',
    time: '10.39 น.',
  },
  {
    id: 5,
    type: 'REJECTED',
    title: 'งานถูกตีกลับให้แก้ไข',
    description:
      'โครงการ [ชื่อโครงการ] ถูกตีกลับโดย [ชื่อผู้ตีกลับ] เหตุผล: [ระบุเหตุผล เช่น แก้ไขรหัสสินค้า]',
    time: '09.39 น.',
  },
];

export default function MyToDoDashboard() {
  const { user } = useAuth();
  const columns = myTasksColumns({ user: user ?? undefined });
  const [activeTab, setActiveTab] = useState('all');

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <h1 className="h1-topic text-primary w-full">สวัสดี, {user?.name}</h1>

      {/* Top Section: Notifications & Calendar */}
      <div className="flex flex-col gap-6 xl:flex-row">
        <NotificationList notifications={NOTIFICATIONS} />
        <CalendarWidget />
      </div>

      {/* Middle Section: Stats */}
      <ProjectStats variant="summary" />

      {/* Bottom Section: Jobs Table */}
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
    </div>
  );
}
