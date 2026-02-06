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

interface CancelProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName?: string;
  isAuthorized?: boolean;
}

export function DeleteMemberDialog({
  isOpen,
  onClose,
  onConfirm,
  memberName,
}: CancelProjectDialogProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            ลบสมาชิก
          </DialogTitle>
          <DialogDescription>
            <span className="text-primary font-medium">
              คุณแน่ใจหรือไม่ที่จะลบสมาชิก{memberName}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            ยืนยันการลบสมาชิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
