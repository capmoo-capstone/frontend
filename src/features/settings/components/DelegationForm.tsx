import { Controller, type UseFormReturn } from 'react-hook-form';

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
  className,
}: DelegationFormProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3 rounded-md bg-slate-50 p-3">
        <span className="normal w-full font-medium text-red-500 sm:w-auto">{startLabel}</span>

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

        <span className="normal font-medium text-slate-600">{endLabel}</span>

        <Controller
          name="end_date"
          control={form.control}
          render={({ field }) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              disabledDays={(date) => {
                const startDate = form.getValues('start_date');
                return !!startDate && date < startDate;
              }}
              className="w-44 bg-white"
              placeholder="กรุณาเลือกวันที่"
            />
          )}
        />
      </div>

      <div className="caption mt-2 flex flex-col gap-1 text-red-500">
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
