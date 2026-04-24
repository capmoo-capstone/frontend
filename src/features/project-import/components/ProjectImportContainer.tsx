import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { toast } from 'sonner';

import { useDepartments, useUnitsList } from '@/features/organization';
import { OPS_DEPT_ID } from '@/lib/constants';
import { getFiscalYear, normalizeMappedValue, parseThaiDateString } from '@/lib/formatters';

import { useImportProjects } from '../hooks/useCreateProject';
import { useExcelImport } from '../hooks/useExcelImport';
import { useProjectImportPermissions } from '../hooks/useProjectImportPermissions';
import type { ImportMode } from '../types';
import { EditableImportTable } from './EditableImportTable';
import { ExcelUploadZone } from './ExcelUploadZone';
import { ImportSelector } from './ImportSelector';
import { ManualForm } from './ManualForm';

export function ProjectImportContainer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canImportOptions } = useProjectImportPermissions();
  const { mutateAsync: importProjectsMutation } = useImportProjects();

  const modeParam = searchParams.get('mode');
  const isImportMode = (value: string | null): value is ImportMode => {
    return value === 'none' || value === 'manual' || value === 'lesspaper' || value === 'fiori';
  };
  const mode: ImportMode = isImportMode(modeParam) ? modeParam : 'none';

  const { data: departments } = useDepartments();
  const filteredDepartments = useMemo(
    () => departments?.filter((dept) => dept.id !== OPS_DEPT_ID),
    [departments]
  );

  const { data: unitsList } = useUnitsList({ page: 1, limit: 1000 });
  const units = unitsList?.data;

  const currentYear = getFiscalYear(new Date());
  const fiscalYears = Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString());

  useEffect(() => {
    if (!canImportOptions && (mode === 'lesspaper' || mode === 'fiori' || mode === 'none')) {
      setSearchParams({ mode: 'manual' }, { replace: true });
    }
  }, [mode, canImportOptions, setSearchParams]);

  const { data, setData, handleFileUpload, updateRow, deleteRow, isParsing } = useExcelImport(mode);

  useEffect(() => {
    setData([]);
  }, [mode, setData]);

  const handleSuccess = async (importData?: typeof data) => {
    try {
      if (importData && (mode === 'lesspaper' || mode === 'fiori')) {
        const departmentNameToId = new Map(
          (filteredDepartments ?? []).map((dept) => [dept.name, dept.id])
        );
        const unitNameToId = new Map((units ?? []).map((unit) => [unit.name, unit.id]));

        // For batch import, convert data to ProjectImportPayload and call API
        const payloads = importData.map((row) => ({
          pr_no: row.pr_no || undefined,
          lesspaper_no: row.lesspaper_no || undefined,
          title: row.title || '',
          description: row.description || '',
          procurement_type: row.procurement_type || '',
          budget: Number(row.budget || 0),
          department_id: normalizeMappedValue(row.department_id, departmentNameToId),
          unit_id: normalizeMappedValue(row.unit_id, unitNameToId),
          fiscal_year: row.fiscal_year || currentYear.toString(),
          delivery_date: row.delivery_date_str
            ? parseThaiDateString(row.delivery_date_str, 'ymd', '-')
            : undefined,
          budget_plan_ids: [],
        }));

        await importProjectsMutation(payloads);
      }

      navigate('/app/project-import/success?mode=' + mode);
    } catch (error) {
      console.error('Project import failed:', error);
      toast.error('นำเข้าโครงการไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
    }
  };

  const handleSelectMode = (selectedMode: ImportMode) => {
    setSearchParams({ mode: selectedMode.toLowerCase() });
  };

  const handleBack = () => {
    navigate('/app/project-import');
  };

  return (
    <div className="mx-auto w-full p-6">
      {mode === 'none' && <ImportSelector onSelect={handleSelectMode} />}

      {mode === 'manual' && <ManualForm onBack={handleBack} onSuccess={handleSuccess} />}

      {(mode === 'lesspaper' || mode === 'fiori') && (
        <div className="flex flex-col gap-6">
          <h1 className="h1-topic text-primary">นำเข้าโครงการจาก {mode.toUpperCase()}</h1>

          {data.length === 0 ? (
            <ExcelUploadZone isParsing={isParsing} onFileSelect={handleFileUpload} />
          ) : (
            <EditableImportTable
              data={data}
              updateRow={updateRow}
              deleteRow={deleteRow}
              onSubmit={() => handleSuccess(data)}
              onBack={handleBack}
              departments={filteredDepartments}
              fiscalYears={fiscalYears}
              units={units}
              mode={mode}
            />
          )}
        </div>
      )}
    </div>
  );
}
