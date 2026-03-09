import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="h3-topic flex items-center justify-center">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 text-center">
          {typeof description === 'string' ? (
            <p className="text-base">{description}</p>
          ) : (
            description
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-center gap-4 sm:justify-center">
          <Button variant="brand" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
