import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDevLogin } from '@/hooks/useAuth';

const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Full system access' },
  { value: 'ADMIN', label: 'Admin', description: 'Administrative access' },
  { value: 'HEAD_OF_DEPARTMENT', label: 'Head of Department', description: 'Department leader' },
  { value: 'HEAD_OF_UNIT', label: 'Head of Unit', description: 'Unit leader' },
  { value: 'REPRESENTATIVE', label: 'Representative', description: 'Department representative' },
  { value: 'DOCUMENT_STAFF', label: 'Document Staff', description: 'Document processing' },
  { value: 'FINANCE_STAFF', label: 'Finance Staff', description: 'Finance operations' },
  { value: 'GENERAL_STAFF', label: 'General Staff', description: 'General procurement staff' },
  { value: 'GUEST', label: 'Guest', description: 'Limited access' },
] as const;

const DevLogin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { mutate: devLogin, isPending } = useDevLogin();

  // Redirect to login if not in development mode
  useEffect(() => {
    if (import.meta.env.MODE !== 'development') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleDevLogin = (role: string) => {
    devLogin(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold">🛠️ Dev Login</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quick login with different roles for development and testing
          </p>
          {isAuthenticated && user && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Currently logged in as:{' '}
                <span className="font-bold">
                  {user.name} ({user.role})
                </span>
              </p>
              <Button variant="outline" size="sm" onClick={handleLogout} className="mt-2">
                Logout
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <div
              key={role.value}
              className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              <h3 className="mb-1 text-lg font-semibold">{role.label}</h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => handleDevLogin(role.value)}
              >
                {isPending ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 text-center dark:border-gray-700">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Go to Regular Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevLogin;
