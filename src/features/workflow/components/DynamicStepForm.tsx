import { useState } from 'react';

import { CircleCheckBig } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BudgetPlan } from '@/features/budgets';
import { cn } from '@/lib/utils';

import type { FieldConfig } from '../types';
import { BudgetPlanSelectField } from './fields/BudgetPlanSelectField';
import { ContractNumberGenerator } from './fields/ContractNumberGenerator';
import { DueDateMultiSelect } from './fields/DueDateMultiSelect';
import { MultiEmailInput } from './fields/MultiEmailInput';

interface DynamicStepFormProps {
  fields: FieldConfig[];
  formData: Record<string, unknown>;
  onChange: (field_key: string, value: unknown) => void;
  disabled?: boolean;
  budgetPlans?: BudgetPlan[];
  isLoadingBudgetPlans?: boolean;
  isErrorBudgetPlans?: boolean;
}

export function DynamicStepForm({
  fields,
  formData,
  onChange,
  disabled,
  budgetPlans,
  isLoadingBudgetPlans,
  isErrorBudgetPlans,
}: DynamicStepFormProps) {
  const [skippedFields, setSkippedFields] = useState<Set<string>>(new Set());

  // --- Helpers ---
  const getDateValue = (value: unknown): Date | undefined => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value !== 'string' && typeof value !== 'number') return undefined;
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  const getStringValue = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  };

  const getStringArrayValue = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string');
  };

  const getNumberArrayValue = (value: unknown): number[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is number => typeof item === 'number');
  };

  const getFileValue = (value: unknown): (string | File)[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value as (string | File)[];
    if (typeof value === 'string' || value instanceof File) {
      return [value];
    }
    return [];
  };

  const handleMarkAsDone = (fieldKey: string) => {
    setSkippedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldKey)) newSet.delete(fieldKey);
      else newSet.add(fieldKey);
      return newSet;
    });
  };

  const isFieldSkipped = (fieldKey: string) => skippedFields.has(fieldKey);

  const hasValue = (fieldKey: string): boolean => {
    const value = formData[fieldKey];
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const isSkipped = isFieldSkipped(field.field_key);
        const fieldHasValue = hasValue(field.field_key);

        return (
          <div key={field.field_key} className="space-y-2">
            <Label className="normal">{field.label}</Label>

            <div className={cn(isSkipped && 'pointer-events-none opacity-50')}>
              {/* --- 1. FILE --- */}
              {field.type === 'FILE' && (
                <FileUpload
                  value={getFileValue(formData[field.field_key])}
                  onChange={(files) => onChange(field.field_key, files)}
                  disabled={disabled}
                  placeholder="คลิกเพื่ออัปโหลดเอกสาร"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              )}

              {/* --- 2. TEXT --- */}
              {field.type === 'TEXT' && (
                <Input
                  type="text"
                  value={getStringValue(formData[field.field_key])}
                  onChange={(e) => onChange(field.field_key, e.target.value)}
                  disabled={disabled}
                  placeholder="ระบุข้อมูล..."
                />
              )}

              {/* --- 3. NUMBER --- */}
              {field.type === 'NUMBER' && (
                <Input
                  type="number"
                  value={getStringValue(formData[field.field_key])}
                  onChange={(e) => onChange(field.field_key, e.target.value)}
                  disabled={disabled}
                  placeholder="0"
                />
              )}

              {/* --- 4. DATE --- */}
              {field.type === 'DATE' && (
                <DatePicker
                  date={getDateValue(formData[field.field_key])}
                  setDate={(d) => onChange(field.field_key, d)}
                  className="w-full"
                  disabled={disabled}
                />
              )}

              {/* --- 5. BOOLEAN --- */}
              {field.type === 'BOOLEAN' && (
                <div className="flex h-10 items-center space-x-2">
                  <Checkbox
                    id={field.field_key}
                    checked={!!formData[field.field_key]}
                    onCheckedChange={(c) => onChange(field.field_key, c)}
                    disabled={disabled}
                  />
                  <label htmlFor={field.field_key} className="cursor-pointer text-sm select-none">
                    ใช่ / มีข้อมูลนี้
                  </label>
                </div>
              )}

              {/* --- 6. GENERATE CONTRACT NO --- */}
              {field.type === 'GEN_CONT_NO' && (
                <ContractNumberGenerator
                  value={getStringValue(formData[field.field_key])}
                  onChange={(val) => onChange(field.field_key, val)}
                  disabled={disabled}
                />
              )}

              {/* --- 7. MULTI-EMAIL --- */}
              {(field.type === 'VENDOR_EMAIL' || field.type === 'COMMITTEE_EMAIL') && (
                <MultiEmailInput
                  value={getStringArrayValue(formData[field.field_key])}
                  onChange={(emails) => onChange(field.field_key, emails)}
                  disabled={disabled}
                  placeholder={
                    field.type === 'VENDOR_EMAIL' ? 'ระบุอีเมลผู้ค้า...' : 'ระบุอีเมลกรรมการ...'
                  }
                />
              )}

              {/* --- 8. DUE DATE SELECT --- */}
              {field.type === 'DUE_DATE_SELECT' && (
                <DueDateMultiSelect
                  value={getNumberArrayValue(formData[field.field_key])}
                  onChange={(val) => onChange(field.field_key, val)}
                  disabled={disabled}
                />
              )}

              {/* --- 9. CONTRACT STATUS SELECT --- */}
              {field.type === 'SELECT_CONTRACT_STATUS' && (
                <Select
                  value={getStringValue(formData[field.field_key])}
                  onValueChange={(val) => onChange(field.field_key, val)}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกสถานะ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON_TIME">ตามสัญญา</SelectItem>
                    <SelectItem value="DELAYED">ล่าช้า</SelectItem>
                    <SelectItem value="ABANDONED">ทิ้งงาน</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* --- 10. DELIVERY STATUS SELECT --- */}
              {field.type === 'SELECT_DELIVERY_STATUS' && (
                <Select
                  value={getStringValue(formData[field.field_key])}
                  onValueChange={(val) => onChange(field.field_key, val)}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกสถานะการตรวจรับ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETE">ส่งมอบครบตามกำหนด</SelectItem>
                    <SelectItem value="EXTENDED">มีขยายเวลา งด หรือลดค่าปรับ</SelectItem>
                    <SelectItem value="PENALTY">มีค่าปรับ</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* --- 11. BUDGET PLAN SELECT --- */}
              {field.type === 'SELECT_BUDGET_PLAN' && (
                <BudgetPlanSelectField
                  value={getStringArrayValue(formData[field.field_key])}
                  onChange={(value) => onChange(field.field_key, value)}
                  budgetPlans={budgetPlans}
                  isLoading={isLoadingBudgetPlans}
                  isError={isErrorBudgetPlans}
                  disabled={disabled}
                />
              )}
            </div>

            {/* --- Mark as Done Button --- */}
            {field.mark_as_done &&
              !disabled &&
              !fieldHasValue &&
              ![
                'BOOLEAN',
                'DUE_DATE_SELECT',
                'VENDOR_EMAIL',
                'COMMITTEE_EMAIL',
                'GEN_CONT_NO',
                'SELECT_CONTRACT_STATUS',
                'SELECT_DELIVERY_STATUS',
                'SELECT_BUDGET_PLAN',
              ].includes(field.type) && (
                <Button
                  type="button"
                  variant={isSkipped ? 'outline' : 'default'}
                  size="sm"
                  className={cn('caption w-full')}
                  onClick={() => handleMarkAsDone(field.field_key)}
                >
                  {isSkipped ? (
                    <>
                      <CircleCheckBig className="mr-2 h-3 w-3" />
                      ยกเลิกการทำเครื่องหมายว่าเสร็จ
                    </>
                  ) : (
                    <>
                      <CircleCheckBig className="mr-2 h-3 w-3" />
                      ทำเครื่องหมายว่าเสร็จ
                    </>
                  )}
                </Button>
              )}
          </div>
        );
      })}
    </div>
  );
}
