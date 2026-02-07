'use client';

import { useState } from 'react';

import { isBefore, startOfToday } from 'date-fns';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { UserSelect } from '@/components/user-select';

export function DelegateUserSelect({ onRemoveDelegateUser }: { onRemoveDelegateUser: () => void }) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [checkBox, setCheckBox] = useState<boolean>(false);

  const existingDelegate = true;

  return (
    <div className="bg-background flex w-full items-center gap-4 overflow-x-auto pb-2">
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-info-dark h3-topic whitespace-nowrap">
          แต่งตั้งหัวหน้างานใหม่/ผู้รักษาการแทน
        </span>
        {existingDelegate ? (
          <span className="text-primary text-base font-medium whitespace-nowrap">ชื่อ-นามสกุล</span>
        ) : (
          <UserSelect
            value={selectedUser}
            onChange={setSelectedUser}
            departmentId="department_procure"
            placeholder="เลือกเจ้าหน้าที่..."
            className="w-48"
          />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span className="text-info-dark text-normal font-medium whitespace-nowrap">
          ตั้งแต่วันที่ <span className="text-destructive">*</span>
        </span>
        <DatePicker
          className="w-40"
          date={startDate}
          setDate={setStartDate}
          disabled={(date) => isBefore(date, startOfToday())}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-info-dark text-normal font-medium whitespace-nowrap">
          ถึงวันที่ <span className="text-destructive">*</span>
        </span>
        <DatePicker
          className={`w-40 ${checkBox ? 'bg-secondary' : ''}`}
          date={checkBox ? undefined : endDate}
          setDate={setEndDate}
          isDisabled={checkBox}
          disabled={(date) => (startDate ? date < startDate : false)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="no-end-date-inline"
            checked={checkBox}
            onCheckedChange={(check) => {
              if (check === true) setEndDate(undefined);
              setCheckBox(check === true);
            }}
          />
          <div className="text-primary normal whitespace-nowrap">ไม่กำหนดวันที่สิ้นสุด</div>
        </div>

        <Button
          variant="destructive"
          className="flex h-10 items-center gap-2 px-4 whitespace-nowrap"
          onClick={onRemoveDelegateUser}
        >
          <X className="h-4 w-4" /> ยกเลิกสิทธิ์
        </Button>
      </div>
    </div>
  );
}
