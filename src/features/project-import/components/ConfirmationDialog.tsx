import { ConfirmDialog } from '@/components/shared-dialog';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'ยืนยันและสร้างโครงการ',
  cancelLabel = 'ยกเลิก',
}: ConfirmationDialogProps) {
  return (
    <ConfirmDialog
      isOpen={open}
      onClose={() => {
        onOpenChange(false);
        onCancel();
      }}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      variant="brand"
      destructive
    />
  );
}
