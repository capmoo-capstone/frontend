'use client';

import { useEffect, useState } from 'react';

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

import { useReturnProject } from '../../hooks/useProjectMutations';
import type { Project } from '../../types/index';

interface ReturnProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function ReturnProjectDialog({ isOpen, onClose, project }: ReturnProjectDialogProps) {
  const { mutateAsync: returnProjectMutation, isPending } = useReturnProject();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    const savePromise = returnProjectMutation(project.id);

    toast.promise(savePromise, {
      loading: 'กำลังคืนโครงการ...',
      success: 'คืนโครงการสำเร็จ',
      error: 'เกิดข้อผิดพลาดในการคืนโครงการ',
    });

    try {
      await savePromise;
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>คืนโครงการ</DialogTitle>
          <DialogDescription>
            คุณกำลังจะคืนโครงการ <span className="font-medium">&quot;{project.title}&quot;</span>{' '}
            คุณต้องการคืนโครงการจริง ๆ หรือไม่
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending || isProcessing}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || isProcessing}
            variant="destructive"
          >
            {isProcessing ? 'กำลังคืน...' : 'ยืนยันและคืนโครงการ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
