'use client';

import { toast } from 'sonner';

import { TextInputDialog } from '@/components/shared-dialog';
import { useAuth } from '@/context/AuthContext';

import { useCancelProject } from '../../hooks/useProjectMutations';
import { getCancelProjectActionLabel } from '../../utils/project-selectors';

interface CancelProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
  };
}

export function CancelProjectDialog({ isOpen, onClose, project }: CancelProjectDialogProps) {
  const { user } = useAuth();
  const { mutateAsync: cancelProjectMutation } = useCancelProject();
  const isAuthorized = user?.role === 'SUPER_ADMIN' || user?.role === 'HEAD_OF_DEPARTMENT';
  const actionLabel = getCancelProjectActionLabel(user?.role ?? 'GUEST');

  const handleConfirm = async (reason: string) => {
    const savePromise = cancelProjectMutation({
      projectId: project.id,
      reason,
    });

    toast.promise(savePromise, {
      loading: `กำลัง${actionLabel.toLowerCase()}...`,
      success: `${actionLabel}สำเร็จ`,
      error: `เกิดข้อผิดพลาดในการ${actionLabel.toLowerCase()}`,
    });

    try {
      await savePromise;
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TextInputDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={isAuthorized ? 'ยกเลิกโครงการ' : 'ขอยกเลิกโครงการ'}
      description={
        isAuthorized ? (
          <>
            คุณกำลังจะยกเลิกโครงการ <span className="font-medium">&quot;{project.title}&quot;</span>
            โปรดระบุเหตุผล ในการยกเลิกโครงการนี้
          </>
        ) : (
          <>
            คุณกำลังจะส่งคำขอเพื่อยกเลิกโครงการ{' '}
            <span className="font-medium">&quot;{project.title}&quot;</span> โปรดระบุเหตุผล
            ในการยกเลิกโครงการนี้ หัวหน้ากลุ่มงานจะทำการพิจารณาคำขอยกเลิกของคุณ
          </>
        )
      }
      textareaLabel="ระบุเหตุผลในการยกเลิก"
      textareaPlaceholder="เช่น ข้อมูลซ้ำซ้อน, งบประมาณไม่เพียงพอ..."
      textareaRequired
      confirmLabel={actionLabel}
      cancelLabel="ยกเลิก"
      variant="destructive"
    />
  );
}
