import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDateThai } from '@/lib/formatters';

interface CancellationRequestBannerProps {
  requesterName?: string | null;
  reason?: string | null;
  requestedAt?: string | null;
  canCancelProjects: boolean;
  onRequestApprove?: () => void;
  onRequestReject?: () => void;
}

interface CancelledProjectBannerProps {
  requesterName?: string | null;
  approverName?: string | null;
  reason?: string | null;
  approvedAt?: string | null;
}

const formatDateTimeThai = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return `${formatDateThai(date)} เวลา ${date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })} น.`;
};

export function CancellationRequestBanner({
  requesterName,
  reason,
  requestedAt,
  canCancelProjects,
  onRequestApprove,
  onRequestReject,
}: CancellationRequestBannerProps) {
  const safeRequesterName = requesterName ?? 'ไม่ทราบชื่อ';
  const safeReason = reason ?? '-';

  return (
    <div className="bg-warning-light rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="bg-warning flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="h3-topic text-warning-dark">คำขอยกเลิกโครงการ</h3>
            <p className="caption text-warning-dark mt-1 flex items-center gap-1">
              {formatDateTimeThai(requestedAt)}
            </p>
          </div>
          <div>
            <p className="normal text-primary">
              {safeRequesterName} ขอยกเลิกโครงการ ด้วยเหตุผล &ldquo;{safeReason}&rdquo;
            </p>
          </div>
          {canCancelProjects && (
            <div className="flex items-center gap-2 pt-2">
              <Button variant="destructive" onClick={onRequestApprove}>
                อนุมัติคำขอ
              </Button>
              <Button variant="outline" onClick={onRequestReject}>
                ปฏิเสธคำขอ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CancelledProjectBanner({
  requesterName,
  approverName,
  reason,
  approvedAt,
}: CancelledProjectBannerProps) {
  const safeRequesterName = requesterName ?? 'ไม่ทราบชื่อ';
  const safeApproverName = approverName ?? 'ไม่ทราบชื่อ';
  const safeReason = reason ?? '-';

  return (
    <div className="bg-destructive/10 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="bg-destructive flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="h3-topic text-destructive">โครงการถูกยกเลิก</h3>
            <p className="caption text-destructive mt-1 flex items-center gap-1">
              {formatDateTimeThai(approvedAt)}
            </p>
          </div>
          <div>
            <p className="normal text-primary">
              โครงการนี้ถูกยกเลิกโดย {safeRequesterName} และ {safeApproverName} ด้วยเหตุผล &ldquo;
              {safeReason}
              &rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
