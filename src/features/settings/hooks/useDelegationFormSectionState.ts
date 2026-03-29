import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { startOfToday } from 'date-fns';
import { z } from 'zod';

import { type DelegationPayload, DelegationWithFutureDateSchema } from '@/features/settings/types';

interface UseDelegationFormSectionStateParams {
  value: DelegationPayload | null;
  onChange: (payload: DelegationPayload | null) => void;
  resetKey?: number;
}

type DelegationFormInput = z.input<typeof DelegationWithFutureDateSchema>;

export function useDelegationFormSectionState({
  value,
  onChange,
  resetKey,
}: UseDelegationFormSectionStateParams) {
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

  const minEndDate = formValue.start_date ? new Date(formValue.start_date) : startOfToday();

  return {
    form,
    minEndDate,
  };
}
