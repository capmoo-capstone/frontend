import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDateThai } from '@/lib/formatters';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

interface CancellationRequestBannerProps {
  onRequestApprove: () => void;
  onRequestReject: () => void;
}

export function CancellationRequestBanner({
  onRequestApprove,
  onRequestReject,
}: CancellationRequestBannerProps) {
  const now = new Date();

  return (
    <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-6">
      <div className="flex items-start gap-4">
        <div className="bg-destructive/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-5 w-5" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="h3-topic text-destructive">คำขอยกเลิกโครงการ</h3>
            <p className="caption text-muted-foreground mt-1">
              ส่งคำขอเมื่อ {formatDateThai(now)} เวลา{' '}
              {now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </p>
          </div>
          <div>
            <p className="normal text-primary">
              <span className="text-muted-foreground">ผู้ขอ:</span> นางสาว เจ้าหน้าที่
            </p>
            <p className="normal text-primary">
              <span className="text-muted-foreground">เหตุผล:</span>{' '}
              ขอยกเลิกเนื่องจากโครงการมีความล่าช้าในการดำเนินงาน
              และไม่สามารถปฏิบัติงานได้ตามแผนที่วางไว้ ส่งผลกระทบต่อการใช้งบประมาณของหน่วยงาน
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button variant="destructive" onClick={onRequestApprove}>
              อนุมัติและยกเลิกโครงการ
            </Button>
            <Button variant="outline" onClick={onRequestReject}>
              ปฏิเสธคำขอ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CancelledProjectBanner() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - TWO_DAYS_MS);

  return (
    <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-6">
      <div className="flex items-start gap-4">
        <div className="bg-destructive flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="h3-topic text-destructive">โครงการถูกยกเลิกแล้ว</h3>
            <p className="caption text-muted-foreground mt-1">
              ยกเลิกเมื่อ {formatDateThai(now)} เวลา{' '}
              {now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </p>
          </div>
          <div className="bg-background space-y-2 rounded-md p-4">
            <p className="normal text-primary">
              <span className="text-muted-foreground">ผู้ขอยกเลิก:</span> นางสาว เจ้าหน้าที่
            </p>
            <p className="normal text-primary">
              <span className="text-muted-foreground">ผู้อนุมัติ:</span> นายหัวหน้าหน่วยงาน
            </p>
            <p className="normal text-primary">
              <span className="text-muted-foreground">วันที่ขอยกเลิก:</span>{' '}
              {formatDateThai(twoDaysAgo)} เวลา{' '}
              {twoDaysAgo.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </p>
            <div className="border-t pt-2">
              <p className="normal text-muted-foreground">
                <span className="text-foreground font-medium">เหตุผล:</span>{' '}
                ขอยกเลิกเนื่องจากโครงการมีความล่าช้าในการดำเนินงาน
                และไม่สามารถปฏิบัติงานได้ตามแผนที่วางไว้ ส่งผลกระทบต่อการใช้งบประมาณของหน่วยงาน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
