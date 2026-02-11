import { AlertTriangle, Inbox } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { StatusCard } from '@/components/ui/status-card';

export function ProjectStats() {
  return (
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
  );
}
