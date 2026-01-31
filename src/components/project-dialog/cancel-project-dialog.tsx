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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) return;

    setIsLoading(true);
    try {
      await onConfirm(reason);
      setReason('');
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
            {isAuthorized ? 'ยกเลิกโครงการ' : 'ขอยกเลิกโครงการ'}
          </DialogTitle>
          <DialogDescription>
            {isAuthorized ? (
              <>
                คุณกำลังจะยกเลิกโครงการ <span className="font-medium">"{projectTitle}"</span>?
                โปรดระบุเหตุผล ในการยกเลิกโครงการนี้
              </>
            ) : (
              <>
                คุณกำลังจะส่งคำขอเพื่อยกเลิกโครงการ{' '}
                <span className="font-medium">"{projectTitle}"</span> โปรดระบุเหตุผล
                ในการยกเลิกโครงการนี้ หัวหน้ากลุ่มงานจะทำการพิจารณาคำขอยกเลิกของคุณ
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason" className="text-left">
              ระบุเหตุผลในการยกเลิก <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="เช่น ข้อมูลซ้ำซ้อน, งบประมาณไม่เพียงพอ..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isAuthorized ? 'ยกเลิกโครงการ' : 'ส่งคำขอยกเลิกโครงการ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
