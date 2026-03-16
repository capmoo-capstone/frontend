'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { CustomContentDialog } from '@/components/shared-dialog';
import { UserSelect } from '@/components/user-select';

import { useAssignProjects, useProjectDetail } from '../../hooks/useProjects';

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AddAssigneeDialog({ isOpen, onClose, projectId }: AddMemberDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { mutateAsync: assignProjectsMutation, isPending } = useAssignProjects();
  const projectDetail = useProjectDetail(projectId);
  const data = projectDetail.data;
  const unitId =
    (data?.current_template_type !== 'CONTRACT'
      ? data?.assignee_contract?.unit_id
      : data?.assignee_procurement?.unit_id) ?? undefined;

  useEffect(() => {
    if (isOpen) {
      setSelectedUser(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedUser) {
      toast.error('กรุณาเลือกเจ้าหน้าที่');
      return;
    }

    const savePromise = assignProjectsMutation([
      {
        projectId,
        userId: selectedUser,
      },
    ]);

    toast.promise(savePromise, {
      loading: 'กำลังเพิ่มเจ้าหน้าที่...',
      success: 'เพิ่มเจ้าหน้าที่สำเร็จ',
      error: 'เกิดข้อผิดพลาดในการเพิ่มเจ้าหน้าที่',
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
      title="การเพิ่มเจ้าหน้าที่ในโครงการ"
      confirmLabel="ตกลง"
      cancelLabel="ยกเลิก"
      disableConfirm={!selectedUser || isPending}
      centered
    >
      <div className="flex w-full flex-col items-start space-y-2">
        <div className="text-base font-medium">
          ชื่อเจ้าหน้าที่ <span className="text-destructive">*</span>
        </div>

        <div className="relative w-full">
          <UserSelect
            value={selectedUser}
            onChange={setSelectedUser}
            className="normal w-full"
            placeholder="เลือกเจ้าหน้าที่..."
            hasClearButton={false}
            unitId={unitId}
          />
        </div>
      </div>
    </CustomContentDialog>
  );
}
