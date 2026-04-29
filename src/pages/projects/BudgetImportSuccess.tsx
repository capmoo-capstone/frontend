import { useNavigate } from 'react-router-dom';

import { FileCheck, House, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function BudgetImportSuccess() {
  const navigate = useNavigate();

  const handleCreateMore = () => {
    navigate('/app/budget-import');
  };

  const handleGoToHome = () => {
    navigate('/app/home');
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <FileCheck className="text-muted-foreground h-36 w-36" />
      <p className="h1-topic text-primary mb-6">นำเข้าแผนเรียบร้อย</p>

      <Button variant="outline" onClick={handleCreateMore}>
        <Upload />
        นำเข้าแผนเพิ่มเติม
      </Button>
      <Button variant="brand" onClick={handleGoToHome}>
        <House />
        กลับไปที่หน้าหลัก
      </Button>
    </div>
  );
}
