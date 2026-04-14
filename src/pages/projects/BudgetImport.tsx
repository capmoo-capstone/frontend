import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDepartments, useUnitsList } from '@/features/organization';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { EditableImportTable, useExcelImport } from '@/features/project-import';
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

  const handleSuccess = () => {
    navigate('/app/budget-import/success');
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
          <div className="relative flex min-h-100 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-16 transition-colors hover:bg-slate-50">
            <input
              type="file"
              accept=".xlsx, .xls"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
              disabled={isParsing}
            />
            <div className="text-center">
              <p className="mb-2 text-lg font-bold text-[#8B3D6B]">
                {isParsing ? 'กำลังอ่านไฟล์...' : 'คลิกหรือลากไฟล์ Excel มาวางที่นี่'}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">รองรับไฟล์ .xlsx และ .xls</p>
            </div>
          </div>
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
