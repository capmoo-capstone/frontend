import { type Control, Controller } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ProjectImportPayload } from '../types';

interface OrganizationFieldsProps {
  control: Control<ProjectImportPayload>;
  departments: Array<{ id: string; name: string }> | undefined;
  units: Array<{ id: string; name: string }> | undefined;
  fiscalYears: string[];
  isLoadingDepts: boolean;
  isLoadingUnits: boolean;
  canSelectEveryUnits: boolean;
  watchDeptId: string;
}

export function OrganizationFields({
  control,
  departments,
  units,
  fiscalYears,
  isLoadingDepts,
  isLoadingUnits,
  canSelectEveryUnits,
  watchDeptId,
}: OrganizationFieldsProps) {
  return (
    <>
      {/* Department Selection */}
      <Controller
        name="department_id"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              หน่วยงาน <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ''}
              disabled={isLoadingDepts || !canSelectEveryUnits}
            >
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="bg-background"
              >
                <SelectValue placeholder="กรุณาเลือกหน่วยงาน" />
              </SelectTrigger>
              <SelectContent>
                {departments &&
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Unit Selection */}
      <Controller
        name="unit_id"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              ฝ่าย <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ''}
              disabled={isLoadingUnits || !watchDeptId || !canSelectEveryUnits}
            >
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="bg-background"
              >
                <SelectValue placeholder="กรุณาเลือกฝ่าย" />
              </SelectTrigger>
              <SelectContent>
                {units &&
                  units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Fiscal Year */}
      <Controller
        name="fiscal_year"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              ปีงบประมาณ <span className="text-destructive">*</span>
            </FieldLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="bg-background"
              >
                <SelectValue placeholder="เลือกปีงบประมาณ" />
              </SelectTrigger>
              <SelectContent>
                {fiscalYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
