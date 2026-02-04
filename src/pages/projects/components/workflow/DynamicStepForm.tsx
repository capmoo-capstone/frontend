import { useState } from 'react';

import { CircleCheckBig, Plus, Sparkles, Trash2, UserPlus2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// ==========================================
// SUB-COMPONENT: Contract Number Generator
// ==========================================
function ContractNumberGenerator({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [type, setType] = useState('CU');
  const [year, setYear] = useState(new Date().getFullYear() + 543 + ''); // Thai Year
  const [isOpen, setIsOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const hasGeneratedNumber = !!value;

  const handleGenerate = () => {
    // todo
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${type}${randomNum}/${year}`;
    onChange(generated);
    setIsOpen(false);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    if (cancelReason.trim()) {
      // TODO: Store the cancel reason somewhere (e.g., send to backend)
      console.log('Canceling contract number:', value, 'Reason:', cancelReason);
      onChange('');
      setCancelReason('');
      setShowCancelDialog(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        readOnly
        placeholder="กดปุ่มเพื่อสร้างเลขที่..."
        disabled={disabled}
        className="bg-muted/50"
      />

      {/* Generate/Cancel Button */}
      {!hasGeneratedNumber ? (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="text-primary hover:bg-primary/5 shrink-0 gap-2 border-dashed"
            >
              <Sparkles className="h-4 w-4" />
              สร้างเลข
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="leading-none font-medium">สร้างเลขที่สัญญา</h4>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="type">ประเภท</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type" className="col-span-2 h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CU">สำนักงานมหาวิทยาลัย</SelectItem>
                      <SelectItem value="SP">คณะวิทยาศาสตร์การกีฬา</SelectItem>
                      <SelectItem value="PSY">คณะจิตวิทยา</SelectItem>
                      <SelectItem value="NUR">คณะพยาบาลศาสตร์</SelectItem>
                      <SelectItem value="HS">คณะสหเวชศาสตร์</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="year">ปีงบประมาณ</Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="col-span-2 h-9"
                  />
                </div>
              </div>
              <Button onClick={handleGenerate} className="w-full" variant="brand">
                ยืนยันการสร้าง
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="text-destructive hover:bg-destructive/5 shrink-0 gap-2 border-dashed"
              onClick={handleCancelClick}
            >
              <X className="h-4 w-4" />
              ยกเลิก
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="leading-none font-medium">ยกเลิกเลขที่สัญญา</h4>
              <p className="text-muted-foreground text-sm">
                คุณกำลังยกเลิกเลขที่: <span className="text-foreground font-medium">{value}</span>
              </p>
              <div className="space-y-2">
                <Label htmlFor="cancel-reason">เหตุผลในการยกเลิก *</Label>
                <Input
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="ระบุเหตุผล..."
                  className="h-9"
                />
              </div>
              <Button
                onClick={handleConfirmCancel}
                className="w-full"
                variant="destructive"
                disabled={!cancelReason.trim()}
              >
                ยืนยันการยกเลิก
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: Due Date Multi-Select
// ==========================================
function DueDateMultiSelect({
  value = [],
  onChange,
  disabled,
}: {
  value: number[];
  onChange: (v: number[]) => void;
  disabled?: boolean;
}) {
  const options = [
    { value: 3, label: '3 วัน' },
    { value: 5, label: '5 วัน' },
    { value: 7, label: '7 วัน' },
    { value: 15, label: '15 วัน' },
  ];

  const toggleOption = (optionValue: number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue].sort((a, b) => a - b));
    }
  };

  return (
    <div className="flex flex-1 flex-row justify-between space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`due-date-${option.value}`}
            checked={value.includes(option.value)}
            onCheckedChange={() => toggleOption(option.value)}
            disabled={disabled}
          />
          <label
            htmlFor={`due-date-${option.value}`}
            className="cursor-pointer text-sm select-none"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: Multi-Email Input
// ==========================================
function MultiEmailInput({
  value = [],
  onChange,
  placeholder,
  disabled,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [inputValue, setInputValue] = useState('');

  const addEmail = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      // Basic validation could go here
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={addEmail}
          disabled={!inputValue.trim() || disabled}
          variant="default"
        >
          <UserPlus2 className="h-4 w-4" />
          เพิ่ม
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((email, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="flex items-center gap-1 py-1 pr-1 pl-2 font-normal"
            >
              {email}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="rounded-full p-0.5 transition-colors hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
