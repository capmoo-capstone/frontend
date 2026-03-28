import { useForm } from 'react-hook-form';

import { DelegationForm } from '@/features/settings/components/DelegationForm';
import { type DelegationPayload, DelegationSchema } from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';

interface DelegateEditorProps {
  defaultValues?: Partial<DelegationPayload>;
  departmentId?: string;
  unitId?: string;
  onSave: (payload: DelegationPayload) => void;
}

export function DelegateEditor({
  defaultValues,
  departmentId,
  unitId,
  onSave,
}: DelegateEditorProps) {
  const form = useForm<DelegationPayload>({
    defaultValues: {
      user_id: defaultValues?.user_id || '',
      start_date: defaultValues?.start_date,
      end_date: defaultValues?.end_date,
    },
  });

  const submit = form.handleSubmit((values) => {
    const parsed = DelegationSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof DelegationPayload | undefined;
        if (!field) return;

        form.setError(field, {
          type: 'manual',
          message: issue.message,
        });
      });
      return;
    }

    onSave(parsed.data);
  });

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1">
        <label className="normal font-medium">ผู้รับมอบหมาย *</label>
        <UserSelect
          value={form.watch('user_id')}
          deptId={departmentId}
          unitId={unitId}
          onChange={(id) => form.setValue('user_id', id, { shouldValidate: true })}
          hasClearButton={false}
        />
        {form.formState.errors.user_id?.message && (
          <p className="caption text-red-500">{form.formState.errors.user_id.message}</p>
        )}
      </div>

      <DelegationForm form={form} />
    </form>
  );
}
