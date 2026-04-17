import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import { type ImportBudgetPlanPayload, useImportBudgetPlans } from '@/features/budgets';
import { useDepartments, useUnitsList } from '@/features/organization';
import { EditableImportTable, useExcelImport } from '@/features/project-import';
import { ExcelUploadZone } from '@/features/project-import/components/ExcelUploadZone';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { getFiscalYear } from '@/lib/formatters';

export default function BudgetPlanImport() {
  const navigate = useNavigate();

  const { data: departments } = useDepartments();
  const filteredDepartments = useMemo(
    () => departments?.filter((dept) => dept.id !== SUPPLY_OPERATION_DEPARTMENT_ID),
    [departments]
  );

  const { data: unitsResponse } = useUnitsList({ limit: 1000 });
  const units = unitsResponse?.data ?? [];
  const { mutateAsync: importBudgetPlans } = useImportBudgetPlans();
  const mode = 'budget';
  const currentYear = getFiscalYear(new Date());
  const fiscalYears = useMemo(
    () => Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString()),
    [currentYear]
  );

  const { data, setData, handleFileUpload, updateRow, deleteRow, isParsing } = useExcelImport(mode);

  useEffect(() => {
    setData([]);
  }, [mode, setData]);

  const handleSuccess = async () => {
    try {
      const payload: ImportBudgetPlanPayload = data.map((row) => ({
        budget_year: row.budget_year ?? '',
        unit_id: row.unit_id ?? '',
        department_id: row.department_id ?? '',
        activity_type: row.activity_type ?? '',
        activity_type_name: row.activity_type_name ?? '',
        description: row.description ?? '',
        budget_name: row.budget_name ?? '',
        amount: Number(row.amount ?? 0),
      }));

      await importBudgetPlans(payload);
      navigate('/app/budget-import/success');
    } catch (error) {
      console.error('Budget import failed:', error);
      toast.error('นำเข้าแผนงบประมาณไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleBack = () => {
    setData([]);
  };

  return (
    <div className="mx-auto w-full p-6">
      <div className="flex flex-col gap-6">
        <h1 className="h1-topic text-primary">
          นำเข้าแผนรายงานจัดซื้อจัดจ้าง ครุภัณฑ์ และสิ่งก่อสร้างประจำปีงบประมาณ
        </h1>

        {data.length === 0 ? (
          <ExcelUploadZone isParsing={isParsing} onFileSelect={handleFileUpload} />
        ) : (
          <EditableImportTable
            data={data}
            updateRow={updateRow}
            deleteRow={deleteRow}
            onSubmit={handleSuccess}
            onBack={handleBack}
            departments={filteredDepartments}
            units={units}
            fiscalYears={fiscalYears}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
}
