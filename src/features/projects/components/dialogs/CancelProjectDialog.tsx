'use client';

import { AlertTriangle } from 'lucide-react';

import { TextInputDialog } from '@/components/shared-dialog';

interface CancelProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  projectTitle?: string;
  isAuthorized?: boolean;
}

export function CancelProjectDialog({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  isAuthorized = false,
}: CancelProjectDialogProps) {
  return (
    <TextInputDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isAuthorized ? 'ยกเลิกโครงการ' : 'ขอยกเลิกโครงการ'}
      description={
        isAuthorized ? (
          <>
            คุณกำลังจะยกเลิกโครงการ <span className="font-medium">&quot;{projectTitle}&quot;</span>?
            โปรดระบุเหตุผล ในการยกเลิกโครงการนี้
          </>
        ) : (
          <>
            คุณกำลังจะส่งคำขอเพื่อยกเลิกโครงการ{' '}
            <span className="font-medium">&quot;{projectTitle}&quot;</span> โปรดระบุเหตุผล
            ในการยกเลิกโครงการนี้ หัวหน้ากลุ่มงานจะทำการพิจารณาคำขอยกเลิกของคุณ
          </>
        )
      }
      textareaLabel="ระบุเหตุผลในการยกเลิก"
      textareaPlaceholder="เช่น ข้อมูลซ้ำซ้อน, งบประมาณไม่เพียงพอ..."
      textareaRequired
      confirmLabel={isAuthorized ? 'ยกเลิกโครงการ' : 'ส่งคำขอยกเลิกโครงการ'}
      cancelLabel="ยกเลิก"
      variant="destructive"
      icon={AlertTriangle}
    />
  );
}
