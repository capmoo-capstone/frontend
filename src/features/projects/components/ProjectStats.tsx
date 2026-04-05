import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { StatusCard } from '@/components/ui/status-card';

import { useProjectSummary } from '../hooks/useProjectQueries';

type ProjectStatsVariant = 'all' | 'summary' | 'minimal';

interface ProjectStatsProps {
  variant?: ProjectStatsVariant;
}

export function ProjectStats({ variant = 'all' }: ProjectStatsProps) {
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
  const inProgress = data.in_progress;
  const closed = data.closed;
  const cancelled = data.cancelled;
  const urgent = data.urgent;
  const veryUrgent = data.very_urgent;
  const unassigned = data.role === 'SUPPLY' ? data.unassigned : data.not_started;

  if (variant === 'minimal') {
    return (
      <Card className="py-6">
        <div className="grid grid-cols-2 items-center md:grid-cols-3">
          <div className="border-r">
            <StatusCard
              label="กำลังดำเนินการ"
              count={inProgress}
              icon={<Inbox />}
              iconColor="text-warning"
            />
          </div>

          <div className="md:border-r">
            <StatusCard
              label="เสร็จสิ้น"
              count={closed}
              icon={<Inbox />}
              iconColor="text-success"
            />
          </div>

          <div>
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

  if (variant === 'summary') {
    return (
      <Card className="py-6">
        <div className="grid grid-cols-2 items-center md:grid-cols-3 xl:grid-cols-5">
          <div className="border-r border-b md:border-b xl:border-b-0">
            <StatusCard
              label="โครงการทั้งหมด"
              count={total}
              icon={<Inbox />}
              iconColor="text-primary"
            />
          </div>

          <div className="border-b md:border-r md:border-b xl:border-b-0">
            <StatusCard
              label="กำลังดำเนินการ"
              count={inProgress}
              icon={<Inbox />}
              iconColor="text-warning"
            />
          </div>

          <div className="border-r border-b md:border-b xl:border-b-0">
            <StatusCard
              label="เสร็จสิ้น"
              count={closed}
              icon={<Inbox />}
              iconColor="text-success"
            />
          </div>

          <div className="border-b md:border-r xl:border-b-0">
            <StatusCard label="ยกเลิก" count={cancelled} icon={<Inbox />} iconColor="text-error" />
          </div>

          <div>
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

  return (
    <Card className="py-6">
      <div className="grid grid-cols-2 items-center md:grid-cols-4 xl:grid-cols-7">
        <div className="border-r">
          <StatusCard
            label="โครงการทั้งหมด"
            count={total}
            icon={<Inbox />}
            iconColor="text-primary"
          />
        </div>

        <div className="md:border-r">
          <StatusCard
            label="ยังไม่ได้มอบหมาย"
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
          <StatusCard label="เสร็จสิ้น" count={closed} icon={<Inbox />} iconColor="text-success" />
        </div>

        <div className="border-r">
          <StatusCard label="ยกเลิก" count={cancelled} icon={<Inbox />} iconColor="text-error" />
        </div>

        <div className="md:border-r">
          <StatusCard label="ด่วน" count={urgent} icon={<AlertTriangle />} iconColor="text-error" />
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
