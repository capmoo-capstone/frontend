'use client';

import { useState } from 'react';

import { AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <DialogTitle>อนุมัติการยกเลิกโครงการ</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            คุณแน่ใจหรือไม่ว่าต้องการอนุมัติการยกเลิกโครงการ
            {projectTitle && (
              <>
                {' '}
                <strong className="text-foreground">"{projectTitle}"</strong>
              </>
            )}
            {requesterName && (
              <>
                {' '}
                ตามคำขอของ <strong className="text-foreground">{requesterName}</strong>
              </>
            )}
            ? การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            อนุมัติและยกเลิกโครงการ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
