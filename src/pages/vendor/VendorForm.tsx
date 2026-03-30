import { useNavigate } from 'react-router-dom';

import { LockKeyhole } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { VendorForm } from '@/features/vendors';

export default function VendorFormPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="fixed inset-y-0 left-0 hidden w-1/2 lg:block">
        <img src="/vendorBg.png" alt="Vendor Background" className="h-full w-full object-cover" />
      </div>
      <div className="hidden w-1/2 lg:block" />

      <div className="relative flex h-screen w-full flex-col lg:w-1/2">
        <div className="absolute top-25 right-16 z-10">
          <Button variant="secondary" className="normal-b" onClick={() => navigate('/login')}>
            <LockKeyhole className="h-4 w-4" />
            เข้าสู่ระบบสำหรับเจ้าหน้าที่
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-8 lg:px-20">
          <div className="max-w-md">
            <div className="mb-20 flex flex-col items-end">
              <div className="flex flex-row items-center">
                <img src="/chula.svg" alt="Chula Logo" className="mr-4 h-20 w-auto" />
                <h1 className="text-brand-9 mt-9 text-5xl">NexusProcure</h1>
              </div>
              <div className="text-dark normal">Vendor Bill Submission</div>
            </div>
            <VendorForm />
          </div>
        </div>
      </div>
    </div>
  );
}
