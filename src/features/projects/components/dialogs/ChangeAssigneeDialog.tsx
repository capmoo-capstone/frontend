'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserCog } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { CustomContentDialog } from '@/components/shared-dialog';
import { UserSelect } from '@/features/users';

import { useChangeProjectAssignee } from '../../hooks/useProjects';

const ChangeAssigneeFormSchema = z.object({
  userId: z.string().min(1, 'กรุณาเลือกผู้รับผิดชอบ'),
});

type ChangeAssigneeFormValues = z.infer<typeof ChangeAssigneeFormSchema>;

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
  const { mutateAsync, isPending } = useChangeProjectAssignee();

  const form = useForm<ChangeAssigneeFormValues>({
    resolver: zodResolver(ChangeAssigneeFormSchema),
    defaultValues: {
      userId: currentAssigneeId ?? '',
    },
  });

  const selectedUserId = form.watch('userId');

  useEffect(() => {
    if (isOpen) {
      form.reset({ userId: currentAssigneeId ?? '' });
    }
  }, [isOpen, currentAssigneeId, form]);

  const handleConfirm = form.handleSubmit(async (values) => {
    if (values.userId === (currentAssigneeId ?? '')) {
      onClose();
      return;
    }

    const savePromise = mutateAsync({
      projectId,
      userId: values.userId,
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
  });

  return (
    <CustomContentDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="เปลี่ยนผู้รับผิดชอบ"
      description={
        <>
          เลือกเจ้าหน้าที่คนใหม่สำหรับโครงการ{' '}
          <span className="text-primary font-medium">&quot;{projectTitle}&quot;</span>
        </>
      }
      icon={UserCog}
      confirmLabel="บันทึก"
      cancelLabel="ยกเลิก"
      disableConfirm={!selectedUserId || isPending || !form.formState.isValid}
      maxWidth="sm"
    >
      <Controller
        control={form.control}
        name="userId"
        render={({ field }) => (
          <UserSelect
            value={field.value || null}
            onChange={(value) => field.onChange(value ?? '')}
            unitId={unitId}
            className="w-full"
            placeholder="เลือกเจ้าหน้าที่..."
            hasClearButton={false}
          />
        )}
      />
    </CustomContentDialog>
  );
}
