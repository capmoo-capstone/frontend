import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('กรุณาระบุเหตุผลในการขอแก้ไข');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error requesting edit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>ขอแก้ไขโครงการ</DialogTitle>
          <DialogDescription>
            {projectTitle && (
              <span className="mt-2 block text-sm">
                โครงการ: <span className="text-foreground font-medium">{projectTitle}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              เหตุผลในการขอแก้ไข <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="reason"
              placeholder="กรุณาระบุเหตุผลที่ต้องการให้แก้ไข..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !reason.trim()}>
            {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันขอแก้ไข'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
