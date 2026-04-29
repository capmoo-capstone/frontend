import { type Control, Controller } from 'react-hook-form';

import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProcurementTypeEnum } from '@/features/projects/types/enums';
import { getResponsibleTypeFormat } from '@/features/projects/utils/projectFormatters';
import { cn } from '@/lib/utils';

import type { ProjectImportFormValues } from '../types';

interface ProjectDetailsFieldsProps {
  control: Control<ProjectImportFormValues>;
  onProcurementTypeChange: (value: string) => void;
  onDeliveryDateChange: (date: Date | undefined) => void;
  isDateEarly: boolean;
  minDays: number;
  showBudgetWarning: boolean;
  onBudgetChange: (value: number) => void;
}

export function ProjectDetailsFields({
  control,
  onProcurementTypeChange,
  onDeliveryDateChange,
  isDateEarly,
  minDays,
  showBudgetWarning,
  onBudgetChange,
}: ProjectDetailsFieldsProps) {
  const procurementTypeOptions = ProcurementTypeEnum.options.map((value) => ({
    value,
    label: getResponsibleTypeFormat(value).label,
  }));

  return (
    <>
      {/* Project Title */}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              ชื่อโครงการ <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="กรุณากรอกชื่อโครงการ"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              รายละเอียด <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="กรุณากรอกรายละเอียดโครงการ"
              aria-invalid={fieldState.invalid}
              rows={3}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Procurement Type */}
      <Controller
        name="procurement_type"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              วิธีการจัดหา <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val);
                onProcurementTypeChange(val);
              }}
            >
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="กรุณาเลือกวิธีการจัดหา" />
              </SelectTrigger>
              <SelectContent>
                {procurementTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* PR No */}
      <Controller
        name="pr_no"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>เลขที่ใบขอซื้อขอจ้าง (ถ้ามี)</FieldLabel>
            <Input
              name={field.name}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              ref={field.ref}
              id={field.name}
              placeholder="กรุณากรอกเลขที่ใบขอซื้อขอจ้าง"
              aria-invalid={fieldState.invalid}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                field.onChange(digitsOnly);
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Delivery Date */}
      <Controller
        name="delivery_date"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>วันที่ส่งมอบ (ถ้ามี)</FieldLabel>
            <DatePicker
              date={field.value}
              disabledDays={{ before: new Date() }}
              setDate={(date) => {
                field.onChange(date);
                onDeliveryDateChange(date);
              }}
              className="bg-background w-full"
            />
            {isDateEarly && !fieldState.invalid && (
              <p className="caption text-warning-dark mt-1">
                อาจล่าช้า (เกณฑ์ขั้นต่ำ {minDays} วัน)
              </p>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Budget */}
      <Controller
        name="budget"
        control={control}
        render={({ field, fieldState }) => {
          const displayValue =
            field.value === null || field.value === undefined ? '' : String(field.value);

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                วงเงินงบประมาณ (บาท) <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={displayValue}
                type="text"
                inputMode="decimal"
                placeholder="กรุณากรอกวงเงินงบประมาณ"
                aria-invalid={fieldState.invalid}
                className={cn(
                  showBudgetWarning &&
                    !fieldState.invalid &&
                    'border-warning focus-visible:ring-warning-light'
                )}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);

                  if (value === '') {
                    onBudgetChange(0);
                  } else {
                    const sanitized = value.replace(/,/g, '').trim();
                    const parsedValue = Number(sanitized);
                    if (Number.isFinite(parsedValue)) {
                      onBudgetChange(parsedValue);
                    }
                  }
                }}
              />
              {showBudgetWarning && !fieldState.invalid && (
                <p className="caption text-warning-dark">
                  จำนวนเงินน้อยกว่าวงเงินงบประมาณที่ตั้งไว้
                </p>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </>
  );
}
