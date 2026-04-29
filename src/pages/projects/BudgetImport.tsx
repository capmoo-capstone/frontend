import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import { type ImportBudgetPlanPayload, useImportBudgetPlans } from '@/features/budgets';
import { useDepartments, useUnitsList } from '@/features/organization';
import { EditableImportTable, useExcelImport } from '@/features/project-import';
import { ExcelUploadZone } from '@/features/project-import/components/ExcelUploadZone';
import { OPS_DEPT_ID } from '@/lib/constants';
import { getFiscalYear, normalizeMappedValue, normalizeYearToBE } from '@/lib/formatters';

export default function BudgetPlanImport() {
  const navigate = useNavigate();

  const { data: departments } = useDepartments();
  const filteredDepartments = useMemo(
    () => departments?.filter((dept) => dept.id !== OPS_DEPT_ID),
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
      const departmentNameToId = new Map(
        (filteredDepartments ?? []).map((dept) => [dept.name, dept.id])
      );
      const unitNameToId = new Map((units ?? []).map((unit) => [unit.name, unit.id]));

      const payload: ImportBudgetPlanPayload = data.map((row) => ({
        budget_year: normalizeYearToBE(row.budget_year, currentYear),
        unit_id: normalizeMappedValue(row.unit_id, unitNameToId),
        department_id: normalizeMappedValue(row.department_id, departmentNameToId),
        activity_type: row.activity_type ?? '',
        activity_type_name: row.activity_type_name ?? '',
        description: row.description ?? '',
        budget_name: row.budget_name ?? '',
        budget_amount: Number(row.budget_amount ?? 0),
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
