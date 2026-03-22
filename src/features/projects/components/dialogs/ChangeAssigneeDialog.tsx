'use client';

import { useEffect, useState } from 'react';

import { UserCog } from 'lucide-react';
import { toast } from 'sonner';

import { CustomContentDialog } from '@/components/shared-dialog';
import { UserSelect } from '@/features/users';

import { useChangeProjectAssignee } from '../../hooks/useProjects';

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
    <CustomContentDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="เปลี่ยนผู้รับผิดชอบ"
      description={
        <>
          เลือกเจ้าหน้าที่คนใหม่สำหรับโครงการ{' '}
          <span className="text-primary font-medium">"{projectTitle}"</span>
        </>
      }
      icon={UserCog}
      confirmLabel="บันทึก"
      cancelLabel="ยกเลิก"
      disableConfirm={!selectedUser || isPending}
      maxWidth="sm"
    >
      <UserSelect
        value={selectedUser}
        onChange={setSelectedUser}
        unitId={unitId}
        className="w-full"
        placeholder="เลือกเจ้าหน้าที่..."
        hasClearButton={false}
      />
    </CustomContentDialog>
  );
}
