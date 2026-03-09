import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useDepartments } from '@/features/organization';
import {
  EditableImportTable,
  type ImportMode,
  ImportSelector,
  ManualForm,
  useExcelImport,
} from '@/features/project-import';
import { getFiscalYear } from '@/lib/formatters';
import { hasImportOptionsPermission } from '@/lib/permissions';

export default function ProjectImport() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const modeParam = searchParams.get('mode') as ImportMode | null;
  const mode: ImportMode = modeParam ?? 'none';

  const canSeeOptions = user ? hasImportOptionsPermission(user) : false;

  // Fetch organization data for select fields
  const { data: departments } = useDepartments();

  // Generate fiscal years
  const currentYear = getFiscalYear(new Date());
  const fiscalYears = Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString());

  useEffect(() => {
    if (!canSeeOptions) {
      if (mode === 'lesspaper' || mode === 'fiori') {
        setSearchParams({ mode: 'manual' }, { replace: true });
      }
      if (mode === 'none') {
        setSearchParams({ mode: 'manual' }, { replace: true });
      }
    }
  }, [mode, canSeeOptions, setSearchParams]);

  const { data, handleFileUpload, updateRow, deleteRow, isParsing } = useExcelImport(mode);

  const handleSuccess = () => {
    navigate('/app/projects/import/success?mode=' + mode);
  };

  const handleSelectMode = (selectedMode: ImportMode) => {
    setSearchParams({ mode: selectedMode.toLowerCase() });
  };

  const handleBack = () => {
    navigate('/app/projects/import');
  };

  return (
    <div className="mx-auto w-full p-6">
      {mode === 'none' && <ImportSelector onSelect={handleSelectMode} />}

      {mode === 'manual' && <ManualForm onBack={handleBack} onSuccess={handleSuccess} />}

      {(mode === 'lesspaper' || mode === 'fiori') && (
        <div className="flex flex-col gap-6">
          <h1 className="h1-topic text-primary">นำเข้าโครงการจาก {mode.toUpperCase()}</h1>

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
              departments={departments}
              fiscalYears={fiscalYears}
              mode={mode}
            />
          )}
        </div>
      )}
    </div>
  );
}
