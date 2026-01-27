import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login as loginApi } from '@/api/user.api';
import { useAuth } from '@/context/AuthContext';

export const useLogin = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ cunet, password }: { cunet: string; password: string }) =>
      loginApi(cunet, password),

    onSuccess: (user) => {
      setSession(user);

      if (user.department?.name === 'procurement') {
        navigate('/app/me/dashboard');
      } else {
        navigate('/app/dashboards/department');
      }
    },
  });
};

export const useLogout = () => {
  const { logout: clearSession } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve(true);
    },
    onSettled: () => {
      clearSession();

      queryClient.clear();

      navigate('/login', { replace: true });
    },
  });
};
