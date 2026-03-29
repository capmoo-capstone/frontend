import { Controller } from 'react-hook-form';

import { startOfToday } from 'date-fns';

import { DatePicker } from '@/components/ui/date-picker';
import type { SettingsPerson } from '@/features/settings/mock-data';
import { type DelegationPayload } from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';

import { useDelegationFormSectionState } from '../hooks/useDelegationFormSectionState';

interface DelegationFormSectionProps {
  value: DelegationPayload | null;
  onChange: (payload: DelegationPayload | null) => void;
  people: SettingsPerson[];
  resetKey?: number;
}

export function DelegationFormSection({
  value,
  onChange,
  people,
  resetKey,
}: DelegationFormSectionProps) {
  const { form, minEndDate } = useDelegationFormSectionState({
    value,
    onChange,
    resetKey,
  });

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
              disabledDays={{ before: startOfToday() }}
            />
          )}
        />
        <span className="normal">ถึง</span>
        <Controller
          control={form.control}
          name="end_date"
          render={({ field }) => {
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
