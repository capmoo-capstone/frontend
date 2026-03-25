import { type Control, Controller } from 'react-hook-form';

import { ChevronDown, X } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { BudgetPlan } from '@/features/budgets';
import { cn } from '@/lib/utils';

import type { ProjectImportFormValues } from '../types';

interface BudgetPlanFieldProps {
  control: Control<ProjectImportFormValues>;
  budgetPlans: BudgetPlan[] | undefined;
  isLoadingBudgets: boolean;
  isErrorBudgets: boolean;
  watchUnitId: string;
  watchFiscalYear: string;
}

export function BudgetPlanField({
  control,
  budgetPlans,
  isLoadingBudgets,
  isErrorBudgets,
  watchUnitId,
  watchFiscalYear,
}: BudgetPlanFieldProps) {
  return (
    <Controller
      name="budget_plan_ids"
      control={control}
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
                      <span className="normal-normal">กรุณาเลือกแผนงบประมาณ</span>
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
                  {isLoadingBudgets && (
                    <div className="text-muted-foreground px-3 py-3 text-sm">
                      กำลังโหลดข้อมูลแผนงบประมาณ...
                    </div>
                  )}

                  {isErrorBudgets && (
                    <div className="text-destructive px-3 py-3 text-sm">
                      ไม่สามารถโหลดข้อมูลแผนงบประมาณได้
                    </div>
                  )}

                  {!isLoadingBudgets && !isErrorBudgets && budgetPlans?.length === 0 && (
                    <div className="text-muted-foreground px-3 py-3 text-sm">
                      ไม่พบข้อมูลแผนงบประมาณ
                    </div>
                  )}

                  {!isLoadingBudgets &&
                    !isErrorBudgets &&
                    budgetPlans &&
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
  );
}
