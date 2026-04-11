import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { StatusCard } from '@/components/ui/status-card';

import { useProjectSummary } from '../hooks/useProjectQueries';

export function ProjectStats() {
  const { data, isLoading, isError } = useProjectSummary();

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
  const urgent = data.URGENT;
  const isExternal = data.role === 'EXTERNAL';

  if (isExternal) {
    const notStarted = data.NOT_STARTED;

    return (
      <Card className="py-6">
        <div className="grid grid-cols-2 items-center md:grid-cols-3 xl:grid-cols-6">
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

          <div className="md:border-r xl:border-r-0">
            <StatusCard
              label="ด่วน"
              count={urgent}
              icon={<AlertTriangle />}
              iconColor="text-error"
            />
          </div>
        </div>
      </Card>
    );
  }

  const unassigned = data.UNASSIGNED;
  const waitingAccept = data.WAITING_ACCEPT;

  return (
    <Card className="py-6">
      <div className="grid grid-cols-2 items-center md:grid-cols-4 xl:grid-cols-7">
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
            label="รอการตอบรับ"
            count={waitingAccept}
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

        <div className="md:border-r xl:border-r-0">
          <StatusCard label="ด่วน" count={urgent} icon={<AlertTriangle />} iconColor="text-error" />
        </div>
      </div>
    </Card>
  );
}
