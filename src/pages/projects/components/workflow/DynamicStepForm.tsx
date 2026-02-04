import { useState } from 'react';

import { CircleCheckBig } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type FieldConfig } from '@/types/workflow';

import { ContractNumberGenerator } from './fields/ContractNumberGenerator';
import { DueDateMultiSelect } from './fields/DueDateMultiSelect';
import { MultiEmailInput } from './fields/MultiEmailInput';

interface DynamicStepFormProps {
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
}

export function DynamicStepForm({ fields, formData, onChange, disabled }: DynamicStepFormProps) {
  const [skippedFields, setSkippedFields] = useState<Set<string>>(new Set());

  // --- Helpers ---
  const getDateValue = (value: any): Date | undefined => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  const getFileValue = (value: any): (string | File)[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
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
        const isSkipped = isFieldSkipped(field.key);
        const fieldHasValue = hasValue(field.key);

        return (
          <div key={field.key} className="space-y-2">
            <Label className="normal">
              {field.label} {field.mark_as_done && <span className="text-destructive">*</span>}
            </Label>

            <div className={cn(isSkipped && 'pointer-events-none opacity-50')}>
              {/* --- 1. FILE --- */}
              {field.type === 'FILE' && (
                <FileUpload
                  value={getFileValue(formData[field.key])}
                  onChange={(files) => onChange(field.key, files)}
                  disabled={disabled}
                  placeholder="คลิกเพื่ออัปโหลดเอกสาร"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              )}

              {/* --- 2. TEXT --- */}
              {field.type === 'TEXT' && (
                <Input
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  disabled={disabled}
                  placeholder="ระบุข้อมูล..."
                />
              )}

              {/* --- 3. NUMBER --- */}
              {field.type === 'NUMBER' && (
                <Input
                  type="number"
                  value={formData[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  disabled={disabled}
                  placeholder="0"
                />
              )}

              {/* --- 4. DATE --- */}
              {field.type === 'DATE' && (
                <DatePicker
                  date={getDateValue(formData[field.key])}
                  setDate={(d) => onChange(field.key, d)}
                  className="w-full"
                  disabled={disabled}
                />
              )}

              {/* --- 5. BOOLEAN --- */}
              {field.type === 'BOOLEAN' && (
                <div className="flex h-10 items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={!!formData[field.key]}
                    onCheckedChange={(c) => onChange(field.key, c)}
                    disabled={disabled}
                  />
                  <label htmlFor={field.key} className="cursor-pointer text-sm select-none">
                    ใช่ / มีข้อมูลนี้
                  </label>
                </div>
              )}

              {/* --- 6. GENERATE CONTRACT NO --- */}
              {field.type === 'GEN_CONT_NO' && (
                <ContractNumberGenerator
                  value={formData[field.key] || ''}
                  onChange={(val) => onChange(field.key, val)}
                  disabled={disabled}
                />
              )}

              {/* --- 7. MULTI-EMAIL --- */}
              {(field.type === 'VENDOR_EMAIL' || field.type === 'COMMITTEE_EMAIL') && (
                <MultiEmailInput
                  value={formData[field.key] || []}
                  onChange={(emails) => onChange(field.key, emails)}
                  disabled={disabled}
                  placeholder={
                    field.type === 'VENDOR_EMAIL' ? 'ระบุอีเมลผู้ค้า...' : 'ระบุอีเมลกรรมการ...'
                  }
                />
              )}

              {/* --- 8. DUE DATE SELECT --- */}
              {field.type === 'DUE_DATE_SELECT' && (
                <DueDateMultiSelect
                  value={formData[field.key] || []}
                  onChange={(val) => onChange(field.key, val)}
                  disabled={disabled}
                />
              )}
            </div>

            {/* --- Mark as Done Button --- */}
            {!field.mark_as_done &&
              !disabled &&
              !fieldHasValue &&
              ![
                'BOOLEAN',
                'DUE_DATE_SELECT',
                'VENDOR_EMAIL',
                'COMMITTEE_EMAIL',
                'GEN_CONT_NO',
              ].includes(field.type) && (
                <Button
                  type="button"
                  variant={isSkipped ? 'outline' : 'default'}
                  size="sm"
                  className={cn('caption w-full')}
                  onClick={() => handleMarkAsDone(field.key)}
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
