import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';

import { login as loginApi } from '../api';

interface LoginInput {
  username: string;
  full_name: string;
}

export const useLogin = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, full_name }: LoginInput) => loginApi(username, full_name),

    onSuccess: async (user) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['users', 'selection'] });
      setSession(user);

      if (user.department?.name === 'procurement') {
        navigate('/app/me/dashboard');
      } else {
        navigate('/app/home');
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['users', 'selection'] });
    },
    onSettled: () => {
      clearSession();

      queryClient.clear();

      navigate('/login', { replace: true });
    },
  });
};
