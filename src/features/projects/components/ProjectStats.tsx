import { AlertTriangle, Inbox } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { StatusCard } from '@/components/ui/status-card';

type ProjectStatsVariant = 'all' | 'summary' | 'minimal';

interface ProjectStatsProps {
  variant?: ProjectStatsVariant;
}

export function ProjectStats({ variant = 'all' }: ProjectStatsProps) {
  if (variant === 'minimal') {
    return (
      <Card className="py-6">
        <div className="grid grid-cols-2 items-center md:grid-cols-3">
          <div className="border-r">
            <StatusCard
              label="กำลังดำเนินการ"
              count={320}
              icon={<Inbox />}
              iconColor="text-warning"
            />
          </div>

          <div className="md:border-r">
            <StatusCard label="เสร็จสิ้น" count={2800} icon={<Inbox />} iconColor="text-success" />
          </div>

          <div>
            <StatusCard label="ด่วน" count={12} icon={<AlertTriangle />} iconColor="text-error" />
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
              count={3156}
              icon={<Inbox />}
              iconColor="text-primary"
            />
          </div>

          <div className="border-b md:border-r md:border-b xl:border-b-0">
            <StatusCard
              label="กำลังดำเนินการ"
              count={320}
              icon={<Inbox />}
              iconColor="text-warning"
            />
          </div>

          <div className="border-r border-b md:border-b xl:border-b-0">
            <StatusCard label="เสร็จสิ้น" count={2800} icon={<Inbox />} iconColor="text-success" />
          </div>

          <div className="border-b md:border-r xl:border-b-0">
            <StatusCard label="ยกเลิก" count={32} icon={<Inbox />} iconColor="text-error" />
          </div>

          <div>
            <StatusCard label="ด่วน" count={12} icon={<AlertTriangle />} iconColor="text-error" />
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
            count={3156}
            icon={<Inbox />}
            iconColor="text-primary"
          />
        </div>

        <div className="md:border-r">
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

        <div className="md:border-r">
          <StatusCard label="เสร็จสิ้น" count={2800} icon={<Inbox />} iconColor="text-success" />
        </div>

        <div className="border-r">
          <StatusCard label="ยกเลิก" count={32} icon={<Inbox />} iconColor="text-error" />
        </div>

        <div className="md:border-r">
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
  );
}
