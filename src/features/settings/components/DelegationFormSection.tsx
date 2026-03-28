import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DatePicker } from '@/components/ui/date-picker';
import type { SettingsPerson } from '@/features/settings/mock-data';
import { type DelegationPayload, DelegationWithFutureDateSchema } from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';

interface DelegationFormSectionProps {
  value: DelegationPayload | null;
  onChange: (payload: DelegationPayload | null) => void;
  people: SettingsPerson[];
  resetKey?: number;
}

type DelegationFormInput = z.input<typeof DelegationWithFutureDateSchema>;

export function DelegationFormSection({
  value,
  onChange,
  people,
  resetKey,
}: DelegationFormSectionProps) {
  const form = useForm<DelegationFormInput>({
    resolver: zodResolver(DelegationWithFutureDateSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: value?.user_id ?? '',
      start_date: value?.start_date,
      end_date: value?.end_date,
    },
  });

  useEffect(() => {
    if (resetKey === undefined) return;

    form.reset(
      {
        user_id: '',
        start_date: undefined,
        end_date: undefined,
      },
      { keepValues: false }
    );
  }, [form, resetKey]);

  const formValue = useWatch({ control: form.control });

  useEffect(() => {
    const parsed = DelegationWithFutureDateSchema.safeParse({
      user_id: formValue.user_id ?? '',
      start_date: formValue.start_date,
      end_date: formValue.end_date,
    });

    onChange(parsed.success ? parsed.data : null);
  }, [formValue.end_date, formValue.start_date, formValue.user_id, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="normal w-20">ตั้งผู้แทน</span>
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
              className="min-w-[320px]"
              hasClearButton={false}
            />
          )}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="normal w-20">ตั้งแต่วันที่</span>
        <Controller
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              className="w-44 bg-white"
              placeholder="Pick a date"
              disabledDays={{ before: new Date() }}
            />
          )}
        />
        <span className="normal">ถึง</span>
        <Controller
          control={form.control}
          name="end_date"
          render={({ field }) => {
            const minEndDate = formValue.start_date ? new Date(formValue.start_date) : new Date();
            return (
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                className="w-44 bg-white"
                placeholder="Pick a date"
                disabledDays={{ before: minEndDate }}
              />
            );
          }}
        />
      </div>

      {(form.formState.errors.user_id ||
        form.formState.errors.start_date ||
        form.formState.errors.end_date) && (
        <div className="caption space-y-1 text-red-500">
          {form.formState.errors.user_id?.message && <p>{form.formState.errors.user_id.message}</p>}
          {form.formState.errors.start_date?.message && (
            <p>{form.formState.errors.start_date.message}</p>
          )}
          {form.formState.errors.end_date?.message && (
            <p>{form.formState.errors.end_date.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
