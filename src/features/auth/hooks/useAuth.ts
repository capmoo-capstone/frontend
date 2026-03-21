import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';

import { devLogin as devLoginApi, login as loginApi } from '../api';

interface LoginInput {
  username: string;
  full_name: string;
}

export const useLogin = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ username, full_name }: LoginInput) => loginApi(username, full_name),

    onSuccess: (user) => {
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
    onSettled: () => {
      clearSession();

      queryClient.clear();

      navigate('/login', { replace: true });
    },
  });
};

export const useDevLogin = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (role: string) => devLoginApi(role),
    onSuccess: (user) => {
      setSession(user);
      navigate('/app', { replace: true });
    },
  });
};
