import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import type { SettingsPerson } from '@/features/settings/mock-data';
import { type DelegationPayload, DelegationWithFutureDateSchema } from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';

interface DelegationFormSectionProps {
  value: DelegationPayload | null;
  onChange: (payload: DelegationPayload | null) => void;
  people: SettingsPerson[];
  roleContext: 'director' | 'group-head';
}

type DelegationFormInput = z.input<typeof DelegationWithFutureDateSchema>;

export function DelegationFormSection({
  value,
  onChange,
  people,
  roleContext,
}: DelegationFormSectionProps) {
  const form = useForm<DelegationFormInput>({
    resolver: zodResolver(DelegationWithFutureDateSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: value?.user_id ?? '',
      start_date: value?.start_date,
      end_date: value?.end_date,
      is_permanent: value?.is_permanent ?? false,
    },
  });

  const formValue = useWatch({ control: form.control });

  useEffect(() => {
    const parsed = DelegationWithFutureDateSchema.safeParse({
      user_id: formValue.user_id ?? '',
      start_date: formValue.start_date,
      end_date: formValue.end_date,
      is_permanent: formValue.is_permanent ?? false,
    });

    onChange(parsed.success ? parsed.data : null);
  }, [
    formValue.end_date,
    formValue.is_permanent,
    formValue.start_date,
    formValue.user_id,
    onChange,
  ]);

  const selectedUserName = useMemo(() => {
    if (!formValue.user_id) return '';
    return people.find((person) => person.id === formValue.user_id)?.full_name || '';
  }, [formValue.user_id, people]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-29.5 text-sm">ตั้งผู้แทน</span>
        <Controller
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <UserSelect
              value={field.value || ''}
              deptId="procurement"
              options={people}
              placeholder="กรุณาเลือกเจ้าหน้าที่"
              onChange={(id) => field.onChange(id)}
              className="max-w-[320px]"
              hasClearButton={false}
            />
          )}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="w-29.5 text-sm text-red-500">ตั้งแต่วันที่ *</span>
        <Controller
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              className="w-44 bg-white"
              placeholder="Pick a date"
            />
          )}
        />
        <span className="text-sm">ถึง</span>
        <Controller
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              disabled={formValue.is_permanent}
              className="w-44 bg-white"
              placeholder="Pick a date"
            />
          )}
        />
        <div className="ml-1 flex items-center gap-2">
          <Controller
            control={form.control}
            name="is_permanent"
            render={({ field }) => (
              <Checkbox
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  const nextValue = checked === true;
                  field.onChange(nextValue);
                  if (nextValue) {
                    form.setValue('end_date', undefined, { shouldValidate: true });
                  }
                }}
              />
            )}
          />
          <span className="text-sm text-slate-600">ไม่กำหนดวันที่สิ้นสุด</span>
        </div>
      </div>

      {(form.formState.errors.user_id ||
        form.formState.errors.start_date ||
        form.formState.errors.end_date) && (
        <div className="space-y-1 text-xs text-red-500">
          {form.formState.errors.user_id?.message && <p>{form.formState.errors.user_id.message}</p>}
          {form.formState.errors.start_date?.message && (
            <p>{form.formState.errors.start_date.message}</p>
          )}
          {form.formState.errors.end_date?.message && (
            <p>{form.formState.errors.end_date.message}</p>
          )}
        </div>
      )}

      {formValue.is_permanent && selectedUserName && (
        <p className="text-xs text-amber-700">
          เมื่อถึงเวลา 00:00 ของวันที่เริ่มต้น ระบบจะอัปเดต
          {roleContext === 'director' ? 'ผู้อำนวยการคนใหม่' : 'หัวหน้ากลุ่มงานคนใหม่'} เป็น{' '}
          {selectedUserName} โดยอัตโนมัติ
        </p>
      )}
    </div>
  );
}
