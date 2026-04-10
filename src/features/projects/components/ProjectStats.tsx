import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { StatusCard } from '@/components/ui/status-card';

import { useProjectPermissions } from '../hooks/useProjectPermissions';
import { useProjectSummary } from '../hooks/useProjectQueries';

export function ProjectStats() {
  const { data, isLoading, isError } = useProjectSummary();
  const { isProcurementStaff } = useProjectPermissions();

  if (isLoading) {
    return (
      <Card className="py-6">
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="py-6">
        <div className="text-destructive flex h-24 items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>เกิดข้อผิดพลาดในการโหลดสถิติโครงการ</span>
        </div>
      </Card>
    );
  }

  const total = data.total;
  const inProgress = data.IN_PROGRESS;
  const closed = data.CLOSED;
  const cancelled = data.CANCELLED;
  const notStarted = data.role === 'EXTERNAL' ? (data as any).NOT_STARTED : 0;
  const urgent = data.URGENT;
  const superUrgent = data.SUPER_URGENT;
  const veryUrgent = data.VERY_URGENT;
  const unassigned = data.role === 'SUPPLY' ? (data as any).UNASSIGNED : (data as any).NOT_STARTED;

  if (!isProcurementStaff) {
    return (
      <Card className="py-6">
        <div className="grid grid-cols-2 items-center md:grid-cols-4 xl:grid-cols-8">
          <div className="border-r border-b md:border-b xl:border-b-0">
            <StatusCard label="ทั้งหมด" count={total} icon={<Inbox />} iconColor="text-primary" />
          </div>

          <div className="border-b md:border-r md:border-b xl:border-b-0">
            <StatusCard
              label="ยังไม่เริ่ม"
              count={notStarted}
              icon={<Inbox />}
              iconColor="text-primary/70"
            />
          </div>

          <div className="border-r border-b md:border-b xl:border-b-0">
            <StatusCard
              label="กำลังดำเนินการ"
              count={inProgress}
              icon={<Inbox />}
              iconColor="text-warning"
            />
          </div>

          <div className="border-b md:border-r xl:border-b-0">
            <StatusCard
              label="ปิดโครงการ"
              count={closed}
              icon={<Inbox />}
              iconColor="text-success"
            />
          </div>

          <div className="border-r">
            <StatusCard label="ยกเลิก" count={cancelled} icon={<Inbox />} iconColor="text-error" />
          </div>

          <div className="md:border-r">
            <StatusCard
              label="ด่วน"
              count={urgent}
              icon={<AlertTriangle />}
              iconColor="text-error"
            />
          </div>

          <div className="border-r">
            <StatusCard
              label="ด่วนที่สุด"
              count={superUrgent}
              icon={<AlertTriangle />}
              iconColor="text-error-dark"
            />
          </div>

          <div>
            <StatusCard
              label="ด่วนพิเศษ"
              count={veryUrgent}
              icon={<AlertTriangle />}
              iconColor="text-error-dark"
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="py-6">
      <div className="grid grid-cols-2 items-center md:grid-cols-4 xl:grid-cols-8">
        <div className="border-r">
          <StatusCard label="ทั้งหมด" count={total} icon={<Inbox />} iconColor="text-primary" />
        </div>

        <div className="md:border-r">
          <StatusCard
            label="ยังไม่มอบหมาย"
            count={unassigned}
            icon={<Inbox />}
            iconColor="text-primary/70"
          />
        </div>

        <div className="border-r">
          <StatusCard
            label="กำลังดำเนินการ"
            count={inProgress}
            icon={<Inbox />}
            iconColor="text-warning"
          />
        </div>

        <div className="md:border-r">
          <StatusCard label="ปิดโครงการ" count={closed} icon={<Inbox />} iconColor="text-success" />
        </div>

        <div className="border-r">
          <StatusCard label="ยกเลิก" count={cancelled} icon={<Inbox />} iconColor="text-error" />
        </div>

        <div className="md:border-r">
          <StatusCard label="ด่วน" count={urgent} icon={<AlertTriangle />} iconColor="text-error" />
        </div>
        <div className="border-r">
          <StatusCard
            label="ด่วนที่สุด"
            count={superUrgent}
            icon={<AlertTriangle />}
            iconColor="text-error-dark"
          />
        </div>
        <div>
          <StatusCard
            label="ด่วนพิเศษ"
            count={veryUrgent}
            icon={<AlertTriangle />}
            iconColor="text-error-dark"
          />
        </div>
      </div>
    </Card>
  );
}
