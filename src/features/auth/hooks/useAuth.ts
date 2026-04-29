import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/useAuth';
import { userKeys } from '@/features/users';
import { OPS_DEPT_ID } from '@/lib/constants';

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
      setSession(user);
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      await queryClient.invalidateQueries({ queryKey: userKeys.selections() });

      const isProcurementStaff = user.roles.some(
        (scope) => scope.dept_id === OPS_DEPT_ID && scope.role !== 'GUEST'
      );

      if (isProcurementStaff) {
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
