'use client';

import { ConfirmDialog } from '@/components/shared-dialog';

interface ApproveCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  projectTitle?: string;
  requesterName?: string;
}

export function ApproveCancelDialog({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  requesterName,
}: ApproveCancelDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="อนุมัติการยกเลิกโครงการ"
      description={
        <>
          คุณแน่ใจหรือไม่ว่าต้องการอนุมัติการยกเลิกโครงการ
          {projectTitle && (
            <>
              {' '}
              <strong className="text-foreground">&quot;{projectTitle}&quot;</strong>
            </>
          )}
          {requesterName && (
            <>
              {' '}
              ตามคำขอของ <strong className="text-foreground">{requesterName}</strong>
            </>
          )}
          ? การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </>
      }
      confirmLabel="อนุมัติและยกเลิกโครงการ"
      cancelLabel="ยกเลิก"
      destructive
    />
  );
}
