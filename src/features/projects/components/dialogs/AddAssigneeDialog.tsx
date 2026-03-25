'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { CustomContentDialog } from '@/components/shared-dialog';
import { UserSelect } from '@/features/users';

import { useAssignProjects, useProjectDetail } from '../../hooks/useProjects';

const AddAssigneeFormSchema = z.object({
  userId: z.string().min(1, 'กรุณาเลือกเจ้าหน้าที่'),
});

type AddAssigneeFormValues = z.infer<typeof AddAssigneeFormSchema>;

interface AddAssigneeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AddAssigneeDialog({ isOpen, onClose, projectId }: AddAssigneeDialogProps) {
  const { mutateAsync: assignProjectsMutation, isPending } = useAssignProjects();
  const projectDetail = useProjectDetail(projectId);
  const data = projectDetail.data;
  const unitId =
    (data?.current_template_type !== 'CONTRACT'
      ? data?.assignee_contract?.unit_id
      : data?.assignee_procurement?.unit_id) ?? undefined;

  const form = useForm<AddAssigneeFormValues>({
    resolver: zodResolver(AddAssigneeFormSchema),
    mode: 'onChange',
    defaultValues: {
      userId: '',
    },
  });

  const selectedUserId = form.watch('userId');

  useEffect(() => {
    if (isOpen) {
      form.reset({ userId: '' });
    }
  }, [isOpen, form]);

  const handleConfirm = form.handleSubmit(async (values) => {
    const savePromise = assignProjectsMutation([
      {
        projectId,
        userId: values.userId,
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
  });

  return (
    <CustomContentDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="การเพิ่มเจ้าหน้าที่ในโครงการ"
      confirmLabel="ตกลง"
      cancelLabel="ยกเลิก"
      disableConfirm={!selectedUserId || isPending || !form.formState.isValid}
      centered
    >
      <div className="flex w-full flex-col items-start space-y-2">
        <div className="text-base font-medium">
          ชื่อเจ้าหน้าที่ <span className="text-destructive">*</span>
        </div>

        <div className="relative w-full">
          <Controller
            control={form.control}
            name="userId"
            render={({ field }) => (
              <UserSelect
                value={field.value || null}
                onChange={(value) => field.onChange(value ?? '')}
                className="normal w-full"
                placeholder="เลือกเจ้าหน้าที่..."
                hasClearButton={false}
                unitId={unitId}
              />
            )}
          />
        </div>
      </div>
    </CustomContentDialog>
  );
}
