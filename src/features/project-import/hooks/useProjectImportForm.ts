import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { useBudgetPlans } from '@/features/budgets';
import { useDepartments, useUnits } from '@/features/organization';
import { getFiscalYear } from '@/lib/formatters';
import { hasProcurementPermission } from '@/lib/permissions';

import { PROCUREMENT_MIN_DAYS, type ProjectImportPayload, ProjectImportSchema } from '../types';
import { useCreateProject } from './useCreateProject';

interface UseProjectImportFormOptions {
  onSuccess: () => void;
}

export function useProjectImportForm({ onSuccess }: UseProjectImportFormOptions) {
  const { user } = useAuth();
  const canSelectEveryUnits = user && hasProcurementPermission(user);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [warningConfirmed, setWarningConfirmed] = useState(false);
  const { mutateAsync: createProjectMutation, isPending: isSubmitting } = useCreateProject();

  const currentYear = getFiscalYear(new Date());

  const form = useForm<ProjectImportPayload>({
    resolver: zodResolver(ProjectImportSchema),
    defaultValues: {
      pr_no: '',
      title: '',
      description: '',
      procurement_type: '',
      fiscal_year: currentYear.toString(),
      department_id: canSelectEveryUnits ? '' : user?.department?.id || '',
      unit_id: canSelectEveryUnits ? '' : user?.unit?.id || '',
      budget_plan_ids: [],
      budget: 0,
    },
  });

  // Watch form fields
  const watchDeptId = form.watch('department_id');
  const watchUnitId = form.watch('unit_id');
  const watchFiscalYear = form.watch('fiscal_year');
  const watchDeliveryDate = form.watch('delivery_date');
  const watchProcurementType = form.watch('procurement_type');
  const selectedPlans = form.watch('budget_plan_ids') || [];
  const typedBudget = form.watch('budget');

  // Fetch data
  const { data: departments, isLoading: isLoadingDepts } = useDepartments();
  const { data: units, isLoading: isLoadingUnits } = useUnits(watchDeptId);
  const {
    data: budgetPlans,
    isLoading: isLoadingBudgets,
    isError: isErrorBudgets,
  } = useBudgetPlans(watchDeptId, watchFiscalYear);

  // Derive warnings
  const minDays = (watchProcurementType && PROCUREMENT_MIN_DAYS[watchProcurementType]) || 0;
  const isDateEarly =
    watchDeliveryDate &&
    watchProcurementType &&
    differenceInDays(watchDeliveryDate, new Date()) < minDays;

  const calculatedSum = budgetPlans
    ? budgetPlans.filter((p) => selectedPlans.includes(p.id)).reduce((a, b) => a + b.amount, 0)
    : 0;
  const showBudgetWarning = selectedPlans.length > 0 && typedBudget < calculatedSum;

  useEffect(() => {
    if (canSelectEveryUnits) {
      form.setValue('unit_id', '');
      form.setValue('budget_plan_ids', []);
    }
  }, [watchDeptId, canSelectEveryUnits, form]);

  useEffect(() => {
    form.setValue('budget_plan_ids', []);
  }, [watchUnitId, watchFiscalYear, form]);

  // Auto-calculate budget when plans are selected
  useEffect(() => {
    if (selectedPlans.length > 0 && budgetPlans) {
      const sum = budgetPlans
        .filter((p) => selectedPlans.includes(p.id))
        .reduce((acc, curr) => acc + curr.amount, 0);
      form.setValue('budget', sum, { shouldValidate: true });
    } else {
      form.setValue('budget', 0, { shouldValidate: true });
    }
  }, [selectedPlans, budgetPlans, form]);

  const onSubmit = async (data: ProjectImportPayload) => {
    if ((isDateEarly || showBudgetWarning) && !warningConfirmed) {
      setShowConfirmationDialog(true);
      return;
    }

    try {
      await createProjectMutation(data);
      onSuccess();
    } catch {
      toast.error('ไม่สามารถสร้างโครงการได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleConfirm = () => {
    setWarningConfirmed(true);
    setShowConfirmationDialog(false);
    form.handleSubmit(async (data) => {
      try {
        await createProjectMutation(data);
        onSuccess();
      } catch {
        toast.error('ไม่สามารถสร้างโครงการได้ กรุณาลองใหม่อีกครั้ง');
      }
    })();
  };

  const handleCancel = () => {
    setShowConfirmationDialog(false);
  };

  const resetConfirmation = () => {
    setWarningConfirmed(false);
  };

  return {
    form,
    user,
    canSelectEveryUnits,
    currentYear,
    // Data
    departments,
    units,
    budgetPlans,
    isLoadingDepts,
    isLoadingUnits,
    isLoadingBudgets,
    isErrorBudgets,
    // Watched values
    watchDeptId,
    watchUnitId,
    watchFiscalYear,
    selectedPlans,
    typedBudget,
    // Warnings
    isDateEarly,
    minDays,
    showBudgetWarning,
    calculatedSum,
    // Dialog state
    showConfirmationDialog,
    isSubmitting,
    // Handlers
    onSubmit,
    handleConfirm,
    handleCancel,
    resetConfirmation,
  };
}
