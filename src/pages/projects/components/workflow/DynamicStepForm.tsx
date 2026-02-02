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

interface DynamicStepFormProps {
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
}

export function DynamicStepForm({ fields, formData, onChange, disabled }: DynamicStepFormProps) {
  const [skippedFields, setSkippedFields] = useState<Set<string>>(new Set());

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
      if (newSet.has(fieldKey)) {
        newSet.delete(fieldKey);
      } else {
        newSet.add(fieldKey);
      }
      return newSet;
    });
  };

  const isFieldSkipped = (fieldKey: string) => skippedFields.has(fieldKey);

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const isSkipped = isFieldSkipped(field.key);
        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>

            <div className={cn(isSkipped && 'pointer-events-none opacity-50')}>
              {/* --- CASE 1: FILE UPLOAD --- */}
              {field.type === 'FILE_UPLOAD' && (
                <FileUpload
                  value={getFileValue(formData[field.key])}
                  onChange={(files) => onChange(field.key, files)}
                  disabled={disabled}
                  placeholder="คลิกเพื่ออัปโหลดเอกสาร"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              )}

              {/* --- CASE 2: TEXT INPUT --- */}
              {field.type === 'TEXT_INPUT' && (
                <Input
                  value={formData[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  disabled={disabled}
                  placeholder="ระบุข้อมูล..."
                />
              )}

              {/* --- CASE 3: DATE PICKER --- */}
              {field.type === 'DATE_PICKER' && (
                <DatePicker
                  date={getDateValue(formData[field.key])}
                  setDate={(d) => onChange(field.key, d)}
                  className="w-full"
                  disabled={disabled}
                />
              )}

              {/* --- CASE 4: DATE WITH CHECKBOX --- */}
              {field.type === 'DATE_WITH_CHECKBOX' && (
                <div className="flex items-center gap-4">
                  <DatePicker
                    date={getDateValue(formData[field.key])}
                    setDate={(d) => onChange(field.key, d)}
                    className="flex flex-1"
                    disabled={disabled}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`${field.key}-check`} disabled={disabled} />
                    <label htmlFor={`${field.key}-check`} className="text-sm">
                      ประชุมเสร็จแล้ว
                    </label>
                  </div>
                </div>
              )}

              {/* --- CASE 5: BOOLEAN (Checkbox) --- */}
              {field.type === 'BOOLEAN' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={!!formData[field.key]}
                    onCheckedChange={(c) => onChange(field.key, c)}
                    disabled={disabled}
                  />
                  <label htmlFor={field.key} className="text-sm">
                    ใช่ / มี
                  </label>
                </div>
              )}
            </div>

            {!field.required && !disabled && (
              <Button
                type="button"
                variant={isSkipped ? 'outline' : 'default'}
                size="sm"
                className={cn('w-full')}
                onClick={() => handleMarkAsDone(field.key)}
              >
                {isSkipped ? (
                  <>
                    <CircleCheckBig className="h-3 w-3" />
                    ยกเลิกการทำเครื่องหมายว่าเสร็จ
                  </>
                ) : (
                  <>
                    <CircleCheckBig className="h-3 w-3" />
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
