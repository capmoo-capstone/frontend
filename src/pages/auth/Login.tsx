import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type LoginRequest, LoginRequestSchema, useLogin } from '@/features/auth';

export default function LoginPage() {
  const { mutate, isPending, isError, error } = useLogin();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      username: '',
      full_name: '',
    },
  });

  const handleLogin = form.handleSubmit((values) => {
    mutate(values);
  });

  const usernameError = form.formState.errors.username?.message;
  const fullNameError = form.formState.errors.full_name?.message;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="fixed inset-y-0 left-0 hidden w-1/2 lg:block">
        <img src="/loginBg.png" alt="Login Background" className="h-full w-full object-cover" />
      </div>
      <div className="hidden w-1/2 lg:block" />

      <div className="flex h-screen flex-col items-center justify-center px-20 lg:w-1/2">
        <div className="max-w-md">
          <div className="mb-20 flex flex-col items-end">
            <div className="flex flex-row items-end">
              <img src="/chula.svg" alt="Chula Logo" className="mr-4 h-20 w-auto" />
              <h1 className="text-brand-9 mt-9 text-5xl">NexusProcure</h1>
            </div>
            <div className="text-dark normal">Procurement Staff Login</div>
          </div>
          <div className="flex w-full flex-col space-y-6">
            <div>
              <label className="normal text-dark">Username</label>
              <Input
                {...form.register('username')}
                placeholder="กรุณากรอก username"
                disabled={isPending}
              />
              {usernameError && (
                <div className="text-destructive mt-2 text-sm">{usernameError}</div>
              )}
            </div>
            <div>
              <label className="normal text-dark">Full Name</label>
              <Input
                {...form.register('full_name')}
                placeholder="กรุณากรอกชื่อ-นามสกุล"
                disabled={isPending}
              />
              {fullNameError && (
                <div className="text-destructive mt-2 text-sm">{fullNameError}</div>
              )}
              {isError && (
                <div className="text-destructive mt-2 text-center text-sm">
                  {(error as Error)?.message || 'เข้าสู่ระบบไม่สำเร็จ'}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-center">
            <Button variant="brand" className="mt-10" onClick={handleLogin} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
