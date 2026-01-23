import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [cunet, setCunet] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await login({ cunet, password });
      if (user.department?.name === 'procurement') {
        navigate('/app/me/dashboard');
      } else {
        navigate('/app/dashboards/department');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      setErrorMsg(error.message || 'CU NET หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <img src="/loginBg.png" alt="Login Background" className="w-1/2" />

      <div className="flex h-screen flex-col items-center justify-center px-50">
        <div className="mb-30 flex flex-col">
          <div className="flex flex-row items-end">
            <img src="/chula.svg" alt="Chula Logo" className="mr-4" />
            <h1 className="text-brand-9 mt-9 text-5xl">NexusProcure</h1>
          </div>
          <div className="text-dark text-normal-normal text-right">Procurement Staff Login</div>
        </div>
        <div className="flex w-full flex-col space-y-6">
          <div>
            <label className="text-normal-normal text-dark">CU NET</label>
            <Input
              value={cunet}
              onChange={(e) => setCunet(e.target.value)}
              placeholder="กรุณากรอก CU NET"
            />
          </div>
          <div>
            <label className="text-normal-normal text-dark">รหัสผ่าน</label>
            <div className="relative w-full">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรุณากรอกรหัสผ่าน"
              />
              {errorMsg && (
                <div className="text-destructive mt-2 text-center text-sm">{errorMsg}</div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
        <Button variant="brand" className="mt-10" onClick={handleLogin} disabled={isLoading}>
          เข้าสู่ระบบ
        </Button>
      </div>
    </div>
  );
}
