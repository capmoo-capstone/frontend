import { useNavigate } from 'react-router-dom';

import { HomeIcon, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function PageNotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <TriangleAlert className="text-dark mb-6 h-36 w-36" />
      <h1 className="text-h1-topic text-dark text-center">ไม่พบหน้าที่ต้องการ</h1>
      <div className="text-normal-normal text-muted-foreground text-center">
        (รหัสข้อผิดพลาด: 404 NOT FOUND)
      </div>
      <Button
        variant="brand"
        className="mt-9"
        onClick={() => {
          if (user?.department?.name === 'procurement') {
            navigate(`/app/me/dashboard`);
          } else {
            navigate(`/app/dashboards/department`);
          }
        }}
      >
        <HomeIcon />
        กลับไปที่หน้าหลัก
      </Button>
    </div>
  );
}
