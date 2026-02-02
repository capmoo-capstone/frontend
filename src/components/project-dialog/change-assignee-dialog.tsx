'use client';

import { useEffect, useState } from 'react';

import { Loader2, UserCog } from 'lucide-react';
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
import { UserSelect } from '@/components/user-select';
import { useChangeProjectAssignee } from '@/hooks/useProjects';

interface ChangeAssigneeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentAssigneeId: string | null;
  projectTitle?: string;
  unitId?: string;
}

export function ChangeAssigneeDialog({
  isOpen,
  onClose,
  projectId,
  currentAssigneeId,
  projectTitle,
  unitId,
}: ChangeAssigneeDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(currentAssigneeId);
  const { mutateAsync, isPending } = useChangeProjectAssignee();

  useEffect(() => {
    if (isOpen) {
      setSelectedUser(currentAssigneeId);
    }
  }, [isOpen, currentAssigneeId]);

  const handleConfirm = async () => {
    if (!selectedUser) {
      toast.error('กรุณาเลือกผู้รับผิดชอบ');
      return;
    }

    if (selectedUser === currentAssigneeId) {
      onClose();
      return;
    }

    const savePromise = mutateAsync({
      projectId,
      userId: selectedUser,
    });

    toast.promise(savePromise, {
      loading: 'กำลังเปลี่ยนผู้รับผิดชอบ...',
      success: 'เปลี่ยนผู้รับผิดชอบสำเร็จ',
      error: 'เกิดข้อผิดพลาดในการเปลี่ยนผู้รับผิดชอบ',
    });

    try {
      await savePromise;
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            เปลี่ยนผู้รับผิดชอบ
          </DialogTitle>
          <DialogDescription>
            เลือกเจ้าหน้าที่คนใหม่สำหรับโครงการ{' '}
            <span className="text-primary font-medium">"{projectTitle}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <UserSelect
            value={selectedUser}
            onChange={setSelectedUser}
            unitId={unitId}
            className="w-full"
            placeholder="เลือกเจ้าหน้าที่..."
            hasClearButton={false}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            ยกเลิก
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedUser || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
