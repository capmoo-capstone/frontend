import { useLocation, useNavigate } from 'react-router-dom';

import { LockKeyhole } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/useAuth';
import { VendorForm } from '@/features/vendors';

export default function VendorFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isInAppRoute = location.pathname.startsWith('/app/');

  if (isInAppRoute) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-brand-9 text-2xl font-semibold sm:text-3xl">
            Vendor Bill Submission
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            กรุณาระบุเลขที่ใบสั่งซื้อและอัปโหลดเอกสารที่เกี่ยวข้อง
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <VendorForm />
        </div>
      </div>
    );
  }

  const handleButtonClick = () => {
    if (user) {
      navigate('/app/home');
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white lg:flex-row">
      <div className="fixed bottom-6 left-6 z-30">
        <Button
          variant="secondary"
          className="normal-b h-auto max-w-[calc(100vw-3rem)] justify-start whitespace-normal text-left sm:whitespace-nowrap"
          onClick={handleButtonClick}
        >
          <LockKeyhole className="h-4 w-4 shrink-0" />
          เข้าสู่ระบบสำหรับเจ้าหน้าที่
        </Button>
      </div>

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

      <div className="relative flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:h-screen lg:px-20">
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
        </div>
      </div>
    </div>
  );
}
