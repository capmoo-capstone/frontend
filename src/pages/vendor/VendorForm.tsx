import { useNavigate } from 'react-router-dom';

import { LockKeyhole } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { VendorForm } from '@/features/vendors';

export default function VendorFormPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white lg:flex-row">
      <div className="relative h-[250px] w-full lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-1/2">
        <img
          src="/vendorBg.png"
          alt="Vendor Background"
          className="hidden h-full w-full object-cover lg:block"
        />
        <img
          src="/vendorBgMobile.png"
          alt="Vendor Background Mobile"
          className="block h-full w-full object-cover lg:hidden"
        />
      </div>
      <div className="hidden lg:block lg:w-1/2" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:h-screen lg:px-20">
        <div className="absolute top-25 right-16 z-10 hidden lg:block">
          <Button variant="secondary" className="normal-b" onClick={() => navigate('/login')}>
            <LockKeyhole className="h-4 w-4" />
            เข้าสู่ระบบสำหรับเจ้าหน้าที่
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-8 lg:px-20">
          <div className="w-fullmax-w-md">
            <div className="mb-20 flex flex-col items-end">
              <div className="flex flex-row items-end">
                <img src="/chula.svg" alt="Chula Logo" className="mr-4 h-12 w-auto lg:h-20" />
                <h1 className="text-brand-9 mt-9 text-4xl lg:text-5xl">NexusProcure</h1>
              </div>
              <div className="text-dark normal">Vendor Bill Submission</div>
            </div>
            <VendorForm />
          </div>
          <div className="mt-15 flex justify-center lg:hidden">
            <Button variant="secondary" className="normal-b" onClick={() => navigate('/login')}>
              <LockKeyhole className="h-4 w-4" />
              เข้าสู่ระบบสำหรับเจ้าหน้าที่
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
