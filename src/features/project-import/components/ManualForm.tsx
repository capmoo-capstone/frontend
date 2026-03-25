import { Button } from '@/components/ui/button';

import { useProjectImportForm } from '../hooks/useProjectImportForm';
import { BudgetPlanField } from './BudgetPlanField';
import { ConfirmationDialog } from './ConfirmationDialog';
import { OrganizationFields } from './OrganizationFields';
import { ProjectDetailsFields } from './ProjectDetailsFields';

interface ManualFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function ManualForm({ onBack, onSuccess }: ManualFormProps) {
  const {
    form,
    canSelectEveryUnits,
    currentYear,
    departments,
    units,
    budgetPlans,
    isLoadingDepts,
    isLoadingUnits,
    isLoadingBudgets,
    isErrorBudgets,
    watchDeptId,
    watchUnitId,
    watchFiscalYear,
    isDateEarly,
    minDays,
    showBudgetWarning,
    showConfirmationDialog,
    isSubmitting,
    onSubmit,
    handleConfirm,
    handleCancel,
    resetConfirmation,
  } = useProjectImportForm({ onSuccess });

  const fiscalYears = Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString());

  return (
    <div className="flex w-full flex-col items-center justify-start gap-6">
      <h1 className="text-primary h1-topic w-full text-left">สร้างโครงการ</h1>
      <div className="w-full max-w-2xl flex-col space-y-6">
        <div className="border-border bg-primary-foreground flex w-full flex-col gap-6 rounded-md border p-8 md:p-12">
          <h2 className="text-primary text-center text-xl font-semibold">กรุณากรอกข้อมูลโครงการ</h2>

          <form
            id="manual-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <OrganizationFields
              control={form.control}
              departments={departments}
              units={units}
              fiscalYears={fiscalYears}
              isLoadingDepts={isLoadingDepts}
              isLoadingUnits={isLoadingUnits}
              canSelectEveryUnits={!!canSelectEveryUnits}
              watchDeptId={watchDeptId}
            />

            <BudgetPlanField
              control={form.control}
              budgetPlans={budgetPlans}
              isLoadingBudgets={isLoadingBudgets}
              isErrorBudgets={isErrorBudgets}
              watchUnitId={watchUnitId}
              watchFiscalYear={watchFiscalYear}
            />

            <ProjectDetailsFields
              control={form.control}
              onProcurementTypeChange={resetConfirmation}
              onDeliveryDateChange={resetConfirmation}
              isDateEarly={!!isDateEarly}
              minDays={minDays}
              showBudgetWarning={showBudgetWarning}
              onBudgetChange={() => {}}
            />
          </form>
        </div>

        <div className="flex w-full justify-end gap-4">
          <Button
            form="manual-form"
            type="submit"
            variant="brand"
            className="min-w-25"
            disabled={isSubmitting}
          >
            ยืนยัน
          </Button>
          <Button type="button" variant="outline" onClick={onBack} className="min-w-25">
            ยกเลิก
          </Button>
        </div>
      </div>
      <ConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={handleCancel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="วันที่ส่งมอบน้อยกว่าปกติ"
        description={
          <>
            <p className="text-base">
              คุณระบุวันที่ส่งมอบน้อยกว่าวันทำงานตามปกติของสำนักพัสดุ
              อาจทำให้เสร็จสิ้นช้ากว่าวันที่คุณระบุ
            </p>
            <p className="text-base font-medium">คุณยืนยันวันที่ส่งมอบดังกล่าวหรือไม่</p>
          </>
        }
      />{' '}
    </div>
  );
}
