'use client';

import { useEffect, useState } from 'react';

import { Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserSelect } from '@/components/user-select';
import { useDelegateUser } from '@/hooks/useUsers';
import type { UserRole } from '@/types/user';

interface DelegateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  role: UserRole;
}

export function DelegateUserDialog({ isOpen, onClose, unitId, role }: DelegateUserDialogProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const { mutateAsync, isPending } = useDelegateUser();

  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedUser) {
      toast.error('กรุณาเลือกเจ้าหน้าที่');
      return;
    }
    if (!startDate) {
      toast.error('กรุณาเลือกวันที่เริ่มต้น');
      return;
    }
    if (!endDate && checkBox === false) {
      toast.error('กรุณาเลือกวันที่สิ้นสุด');
      return;
    }

    const savePromise = mutateAsync({
      unitId,
      userId: selectedUser,
      startDate: startDate,
      endDate: checkBox ? undefined : endDate,
      role,
    });

    toast.promise(savePromise, {
      loading: 'กำลังแต่งตั้งเจ้าหน้าที่...',
      success: 'แต่งตั้งเจ้าหน้าที่สำเร็จ',
      error: 'เกิดข้อผิดพลาดในการแต่งตั้งเจ้าหน้าที่',
    });

    try {
      await savePromise;
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="h3-topic flex items-center justify-center">
            การแต่งตั้งหัวหน้างานใหม่/ผู้รักษาการแทน
          </DialogTitle>
          <DialogDescription className="mt-6 mb-3 flex w-full flex-col items-start">
            <div className="text-primary text-base font-medium">
              ชื่อพนักงาน <span className="text-destructive">*</span>
            </div>
            <UserSelect
              value={selectedUser}
              onChange={setSelectedUser}
              departmentId="department_procure"
              className="w-full"
              placeholder="เลือกเจ้าหน้าที่..."
              hasClearButton={false}
            />
            <div className="flex w-full gap-6">
              <div className="flex flex-1">
                <div className="text-primary text-base font-medium">
                  ตั้งแต่วันที่ <span className="text-destructive">*</span>
                </div>
                <DatePicker
                  className="w-full"
                  date={startDate}
                  setDate={setStartDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>

              <div className="flex flex-1">
                <div className="text-info-dark">
                  ถึงวันที่ <span className="text-destructive text-base">*</span>
                </div>
                <DatePicker
                  className={`w-full ${checkBox ? 'bg-secondary' : ''}`}
                  date={checkBox ? undefined : endDate}
                  setDate={setEndDate}
                  isDisabled={checkBox}
                  disabled={(date) => {
                    const baseDate = new Date(startDate || new Date());
                    baseDate.setHours(0, 0, 0, 0);
                    return date < baseDate;
                  }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="no-end-date"
                checked={checkBox}
                onCheckedChange={(checked) => setCheckBox(checked === true)}
              />
              <div className="text-primary text-base font-normal">ไม่กำหนดวันที่สิ้นสุด</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center justify-center sm:justify-center">
          <Button variant="brand" onClick={handleConfirm} disabled={!selectedUser || isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />} <Check /> ตกลง
          </Button>
          <Button variant="outline" className="ml-4" onClick={onClose} disabled={isPending}>
            <X />
            ยกเลิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
