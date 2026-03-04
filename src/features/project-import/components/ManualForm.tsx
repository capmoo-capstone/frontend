import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays, isBefore, startOfDay } from 'date-fns';
import { ChevronDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useBudgetPlans } from '@/features/budgets';
import { useDepartments, useUnits } from '@/features/organization';
import { RESPONSIBLE_SELECT_OPTIONS, getFiscalYear } from '@/lib/formatters';
import { hasProcurementPermission } from '@/lib/permissions';
import { cn } from '@/lib/utils';

import { PROCUREMENT_MIN_DAYS, type ProjectImportPayload, ProjectImportSchema } from '../types';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export function ManualForm({ onBack, onSuccess }: Props) {
  const { user } = useAuth();

  const canSelectEveryUnits = user && hasProcurementPermission(user);

  const [dateWarning, setDateWarning] = useState('');

  const currentYear = getFiscalYear(new Date());
  const fiscalYears = Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString());

  const form = useForm<ProjectImportPayload>({
    resolver: zodResolver(ProjectImportSchema),
    defaultValues: {
      pr_no: '',
      title: '',
      description: '',
      procurement_type: '',
      fiscal_year: currentYear.toString(),
      department_id: '',
      unit_id: '',
      budget_plan_ids: [],
      budget: 0,
    },
  });

  const watchDeptId = form.watch('department_id');
  const watchUnitId = form.watch('unit_id');
  const watchFiscalYear = form.watch('fiscal_year');
  const selectedPlans = form.watch('budget_plan_ids') || [];
  const typedBudget = form.watch('budget');

  const { data: departments, isLoading: isLoadingDepts } = useDepartments();
  const { data: units, isLoading: isLoadingUnits } = useUnits(watchDeptId);
  const { data: budgetPlans, isLoading: isLoadingBudgets } = useBudgetPlans(
    watchUnitId,
    watchFiscalYear
  );

  // Logic: Auto-calculate budget when a plan is selected
  useEffect(() => {
    if (selectedPlans.length > 0 && budgetPlans) {
      const sum = budgetPlans
        .filter((p) => selectedPlans.includes(p.id))
        .reduce((acc, curr) => acc + curr.amount, 0);
      form.setValue('budget', sum, { shouldValidate: true });
    } else {
      form.setValue('budget', 0, { shouldValidate: true });
    }
  }, [selectedPlans, form]);

  const onSubmit = (data: ProjectImportPayload) => {
    if (data.delivery_date && data.procurement_type) {
      const daysDiff = differenceInDays(data.delivery_date, new Date());
      const minDays = PROCUREMENT_MIN_DAYS[data.procurement_type] || 0;

      if (daysDiff < minDays && !dateWarning) {
        setDateWarning(
          `อาจล่าช้า (เกณฑ์ขั้นต่ำ ${minDays} วัน) กดยืนยันอีกครั้งหากต้องการใช้วันที่นี้`
        );
        return;
      }
    }

    console.log('Submitting:', data);
    onSuccess();
  };

  const calculatedSum = budgetPlans
    ? budgetPlans.filter((p) => selectedPlans.includes(p.id)).reduce((a, b) => a + b.amount, 0)
    : 0;
  const showBudgetWarning = selectedPlans.length > 0 && typedBudget < calculatedSum;

  return (
    <div className="flex w-full flex-col items-center justify-start gap-6">
      {/* Title */}
      <h1 className="text-primary h1-topic w-full text-left">สร้างโครงการ</h1>

      {/* Form */}
      <div className="w-full max-w-2xl flex-col space-y-6">
        {/* Form Card */}
        <div className="border-border bg-primary-foreground flex w-full flex-col gap-6 rounded-md border p-8 md:p-12">
          <h2 className="text-primary text-center text-xl font-semibold">กรุณากรอกข้อมูลโครงการ</h2>

          <form
            id="manual-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            {/* Department Selection */}
            <Controller
              name="department_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    หน่วยงาน <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    disabled={isLoadingDepts}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    ฝ่าย <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    disabled={isLoadingUnits || !watchDeptId}
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
              control={form.control}
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

            {/* Multi-Select Budget Plans */}
            <Controller
              name="budget_plan_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedPlans =
                  field.value?.length > 0 && budgetPlans
                    ? budgetPlans.filter((p) => field.value.includes(p.id))
                    : [];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      แผนรายงานจัดซื้อจัดจ้าง ครุภัณฑ์ และสิ่งก่อสร้างประจำปีงบประมาณ (ถ้ามี)
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          disabled={isLoadingBudgets || !watchUnitId || !watchFiscalYear}
                          className={cn(
                            'border-input bg-background ring-offset-background focus:ring-ring flex min-h-9 w-full items-center justify-between rounded-lg border px-3 py-1.5 text-base focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                            fieldState.invalid && 'border-destructive focus:ring-destructive',
                            !field.value?.length && 'text-muted-foreground'
                          )}
                        >
                          <div className="flex flex-1 flex-wrap gap-2 text-left">
                            {selectedPlans.length > 0 ? (
                              selectedPlans.map((plan) => (
                                <div
                                  key={plan.id}
                                  className="bg-secondary/60 text-foreground hover:bg-secondary flex items-center gap-1.5 rounded-md px-3 py-1.5 text-base font-normal transition-colors"
                                >
                                  <span>
                                    {plan.description} {plan.amount.toLocaleString()} บาท
                                  </span>
                                  <X
                                    className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      field.onChange(field.value.filter((id) => id !== plan.id));
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <span className="normal-normal">
                                กรุณาเลือกแผนงบประมาณ
                              </span>
                            )}
                          </div>
                          <ChevronDown className="text-muted-foreground ml-2 h-4 w-4 shrink-0" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-(--radix-popover-trigger-width) rounded-lg p-0 shadow-md"
                        align="start"
                      >
                        <div className="flex max-h-64 flex-col overflow-y-auto">
                          {budgetPlans &&
                            budgetPlans.map((plan) => {
                              const isSelected = field.value?.includes(plan.id);
                              return (
                                <div
                                  key={plan.id}
                                  className="border-border flex cursor-pointer items-center space-x-3 border-b px-3 py-3 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newValue = isSelected
                                      ? field.value.filter((id) => id !== plan.id)
                                      : [...(field.value || []), plan.id];
                                    field.onChange(newValue);
                                  }}
                                >
                                  <Checkbox checked={isSelected} className="pointer-events-none" />
                                  <span className="text-primary normal-normal">
                                    {plan.description} {plan.amount.toLocaleString()} บาท
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />

            {/* Project Title */}
            <Controller
              name="title"
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
                      setDateWarning('');
                    }}
                  >
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="กรุณาเลือกวิธีการจัดหา" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSIBLE_SELECT_OPTIONS.map((option) => (
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>เลขที่ใบขอซื้อขอจ้าง (ถ้ามี)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="กรุณากรอกเลขที่ใบขอซื้อขอจ้าง"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Delivery Date */}
            <Controller
              name="delivery_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>วันที่ส่งมอบ (ถ้ามี)</FieldLabel>
                  <DatePicker
                    date={field.value}
                    disabledDays={{ before: new Date() }}
                    setDate={(date) => {
                      field.onChange(date);
                      setDateWarning('');
                    }}
                    className="bg-background w-full"
                  />
                  {dateWarning && (
                    <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                      ⚠️ {dateWarning}
                    </div>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Budget */}
            <Controller
              name="budget"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    วงเงินงบประมาณ (บาท) <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    placeholder="กรุณากรอกวงเงินงบประมาณ"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                  {showBudgetWarning && (
                    <p className="mt-2 rounded bg-amber-50 p-2 text-sm text-amber-700">
                      ⚠️ ยอดเงินน้อยกว่าแผนงบประมาณที่เลือกไว้ ({calculatedSum.toLocaleString()}{' '}
                      บาท)
                    </p>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-end gap-4">
          <Button form="manual-form" type="submit" variant="default" className="min-w-[100px]">
            {dateWarning ? 'ยืนยันวันส่งมอบ' : 'ยืนยัน'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack} className="min-w-[100px]">
            ยกเลิก
          </Button>
        </div>
      </div>
    </div>
  );
}
