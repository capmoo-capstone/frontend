import { useMemo, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { UserSearchCombobox } from '@/features/settings';
import type { SettingsPerson } from '@/features/settings/mock-data';
import { type DelegationPayload, DelegationWithFutureDateSchema } from '@/features/settings/types';

interface DelegationFormSectionProps {
  value: DelegationPayload | null;
  onChange: (payload: DelegationPayload | null) => void;
  people: SettingsPerson[];
  roleContext: 'director' | 'group-head';
}

export function DelegationFormSection({
  value,
  onChange,
  people,
  roleContext,
}: DelegationFormSectionProps) {
  const [errors, setErrors] = useState<{
    user_id?: string;
    start_date?: string;
    end_date?: string;
  }>({});

  const selectedUserId = value?.user_id || '';

  const selectedUserName = useMemo(() => {
    if (!selectedUserId) return '';
    return people.find((person) => person.id === selectedUserId)?.full_name || '';
  }, [people, selectedUserId]);

  const validate = (payload: DelegationPayload | null) => {
    if (!payload) {
      setErrors({});
      return true;
    }

    const parsed = DelegationWithFutureDateSchema.safeParse(payload);
    if (parsed.success) {
      setErrors({});
      return true;
    }

    const nextErrors: { user_id?: string; start_date?: string; end_date?: string } = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof typeof nextErrors | undefined;
      if (!key || nextErrors[key]) return;
      nextErrors[key] = issue.message;
    });

    setErrors(nextErrors);
    return false;
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-29.5 text-sm">ตั้งผู้แทน</span>
        <UserSearchCombobox
          value={selectedUserId}
          departmentId="procurement"
          options={people}
          placeholder="กรุณาเลือกเจ้าหน้าที่"
          onChange={(id) => {
            const next = {
              user_id: id,
              start_date: value?.start_date,
              end_date: value?.end_date,
              is_permanent: value?.is_permanent ?? false,
            };
            onChange(next);
            validate(next);
          }}
          className="max-w-[320px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="w-29.5 text-sm text-red-500">ตั้งแต่วันที่ *</span>
        <DatePicker
          date={value?.start_date}
          setDate={(date) => {
            const next = {
              user_id: value?.user_id || '',
              start_date: date,
              end_date: value?.end_date,
              is_permanent: value?.is_permanent ?? false,
            };
            onChange(next);
            validate(next);
          }}
          className="w-44 bg-white"
          placeholder="Pick a date"
        />
        <span className="text-sm">ถึง</span>
        <DatePicker
          date={value?.end_date}
          setDate={(date) => {
            const next = {
              user_id: value?.user_id || '',
              start_date: value?.start_date,
              end_date: date,
              is_permanent: value?.is_permanent ?? false,
            };
            onChange(next);
            validate(next);
          }}
          disabled={value?.is_permanent}
          className="w-44 bg-white"
          placeholder="Pick a date"
        />
        <div className="ml-1 flex items-center gap-2">
          <Checkbox
            checked={value?.is_permanent || false}
            onCheckedChange={(checked) => {
              const next = {
                user_id: value?.user_id || '',
                start_date: value?.start_date,
                end_date: checked ? undefined : value?.end_date,
                is_permanent: checked === true,
              };
              onChange(next);
              validate(next);
            }}
          />
          <span className="text-sm text-slate-600">ไม่กำหนดวันที่สิ้นสุด</span>
        </div>
      </div>

      {(errors.user_id || errors.start_date || errors.end_date) && (
        <div className="space-y-1 text-xs text-red-500">
          {errors.user_id && <p>{errors.user_id}</p>}
          {errors.start_date && <p>{errors.start_date}</p>}
          {errors.end_date && <p>{errors.end_date}</p>}
        </div>
      )}

      {value?.is_permanent && selectedUserName && (
        <p className="text-xs text-amber-700">
          เมื่อถึงเวลา 00:00 ของวันที่เริ่มต้น ระบบจะอัปเดต
          {roleContext === 'director' ? 'ผู้อำนวยการคนใหม่' : 'หัวหน้ากลุ่มงานคนใหม่'} เป็น{' '}
          {selectedUserName} โดยอัตโนมัติ
        </p>
      )}
    </div>
  );
}
