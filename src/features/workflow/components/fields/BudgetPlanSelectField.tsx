import { ChevronDown, X } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { BudgetPlan } from '@/features/budgets';
import { cn } from '@/lib/utils';

interface BudgetPlanSelectFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  budgetPlans?: BudgetPlan[];
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
}

export function BudgetPlanSelectField({
  value,
  onChange,
  budgetPlans,
  isLoading = false,
  isError = false,
  disabled = false,
}: BudgetPlanSelectFieldProps) {
  const selectedPlans =
    value.length > 0 && budgetPlans ? budgetPlans.filter((plan) => value.includes(plan.id)) : [];

  const togglePlan = (planId: string) => {
    const next = value.includes(planId) ? value.filter((id) => id !== planId) : [...value, planId];

    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          disabled={disabled}
          className={cn(
            'border-input bg-background ring-offset-background focus:ring-ring flex min-h-9 w-full items-center justify-between rounded-lg border px-3 py-1.5 text-base focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            value.length === 0 && 'text-muted-foreground'
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
                    {plan.description || '-'} {plan.budget_amount.toLocaleString()} บาท
                  </span>
                  <X
                    className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onChange(value.filter((id) => id !== plan.id));
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
          {isLoading && (
            <div className="text-muted-foreground px-3 py-3 text-sm">
              กำลังโหลดข้อมูลแผนงบประมาณ...
            </div>
          )}

          {isError && (
            <div className="text-destructive px-3 py-3 text-sm">
              ไม่สามารถโหลดข้อมูลแผนงบประมาณได้
            </div>
          )}

          {!isLoading && !isError && budgetPlans?.length === 0 && (
            <div className="text-muted-foreground px-3 py-3 text-sm">ไม่พบข้อมูลแผนงบประมาณ</div>
          )}

          {!isLoading &&
            !isError &&
            budgetPlans &&
            budgetPlans.map((plan) => {
              const isSelected = value.includes(plan.id);
              return (
                <div
                  key={plan.id}
                  className="border-border flex cursor-pointer items-center space-x-3 border-b px-3 py-3 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePlan(plan.id);
                  }}
                >
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                  <span className="text-primary normal-normal">
                    {plan.description || '-'} {plan.budget_amount.toLocaleString()} บาท
                  </span>
                </div>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
