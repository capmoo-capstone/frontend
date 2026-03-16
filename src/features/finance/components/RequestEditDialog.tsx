import { TextInputDialog } from '@/components/shared-dialog';

interface RequestEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  projectTitle?: string;
}

export function RequestEditDialog({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
}: RequestEditDialogProps) {
  return (
    <TextInputDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="ขอแก้ไขโครงการ"
      description={
        projectTitle ? (
          <span className="mt-2 block text-sm">
            โครงการ: <span className="text-foreground font-medium">{projectTitle}</span>
          </span>
        ) : undefined
      }
      textareaLabel="เหตุผลในการขอแก้ไข"
      textareaPlaceholder="กรุณาระบุเหตุผลที่ต้องการให้แก้ไข..."
      textareaRequired
      textareaRows={4}
      confirmLabel="ยืนยันขอแก้ไข"
      cancelLabel="ยกเลิก"
      maxWidth="md"
    />
  );
}
