import { Controller, type UseFormReturn } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import type { DelegationPayload } from '@/features/settings/types';

interface DelegationFormProps {
  form: UseFormReturn<DelegationPayload>;
  startLabel?: string;
  endLabel?: string;
  noEndDateLabel?: string;
  className?: string;
}

export function DelegationForm({
  form,
  startLabel = 'ตั้งแต่วันที่ *',
  endLabel = 'ถึง',
  noEndDateLabel = 'ไม่กำหนดวันที่สิ้นสุด',
  className,
}: DelegationFormProps) {
  const isPermanent = form.watch('is_permanent');

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3 rounded-md bg-slate-50 p-3">
        <span className="w-full text-sm font-medium text-red-500 sm:w-auto">{startLabel}</span>

        <Controller
          name="start_date"
          control={form.control}
          render={({ field }) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              className="w-44 bg-white"
              placeholder="กรุณาเลือกวันที่"
            />
          )}
        />

        <span className="text-sm font-medium text-slate-600">{endLabel}</span>

        <Controller
          name="end_date"
          control={form.control}
          render={({ field }) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              disabled={isPermanent}
              disabledDays={(date) => {
                const startDate = form.getValues('start_date');
                return !!startDate && date < startDate;
              }}
              className="w-44 bg-white"
              placeholder="กรุณาเลือกวันที่"
            />
          )}
        />

        <Controller
          name="is_permanent"
          control={form.control}
          render={({ field }) => (
            <div className="ml-1 flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  const normalized = checked === true;
                  field.onChange(normalized);
                  if (normalized) {
                    form.setValue('end_date', undefined, { shouldValidate: true });
                  }
                }}
              />
              <span className="text-sm text-slate-600">{noEndDateLabel}</span>
            </div>
          )}
        />
      </div>

      <div className="mt-2 flex flex-col gap-1 text-xs text-red-500">
        {form.formState.errors.start_date?.message && (
          <span>{form.formState.errors.start_date.message}</span>
        )}
        {form.formState.errors.end_date?.message && (
          <span>{form.formState.errors.end_date.message}</span>
        )}
      </div>
    </div>
  );
}
