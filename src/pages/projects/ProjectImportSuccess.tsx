import { useNavigate, useSearchParams } from 'react-router-dom';

import { FileCheck, Table2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type ImportMode, useProjectImportPermissions } from '@/features/project-import';

export default function ProjectImportSuccess() {
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];
  const { canImportOptions } = useProjectImportPermissions();

  const modeParam = searchParams.get('mode') as ImportMode | null;
  const mode: ImportMode = modeParam ?? 'manual';

  const handleCreateMore = () => {
    if (canImportOptions) {
      navigate('/app/project-import');
    } else {
      navigate('/app/project-import?mode=manual');
    }
  };

  const handleGoToProjects = () => {
    navigate('/app/projects');
  };

  const modeText = mode === 'manual' ? 'สร้างโครงการ' : 'นำเข้าโครงการ';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <FileCheck className="text-muted-foreground h-36 w-36" />
      <p className="h1-topic text-primary mb-6">{modeText}เรียบร้อย</p>

      <Button variant="outline" onClick={handleCreateMore}>
        <Upload />
        {modeText}เพิ่มเติม
      </Button>
      <Button variant="brand" onClick={handleGoToProjects}>
        <Table2 />
        ไปที่หน้าโครงการทั้งหมด
      </Button>
    </div>
  );
}
