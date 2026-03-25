import api from '@/lib/axios';

import {
  AuthUserSchema,
  BackendLoginResponseSchema,
  LoginRequestSchema,
  type User,
  enrichUser,
} from '../types';

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/user/me');

  const validatedUser = AuthUserSchema.parse(data.data);
  return enrichUser(validatedUser);
};

export const login = async (username: string, full_name: string): Promise<User> => {
  const payload = LoginRequestSchema.parse({ username, full_name });
  const { data } = await api.post('/auth/login', payload);
  const parsed = BackendLoginResponseSchema.parse(data);

  const authData = parsed.data;
  const normalized = {
    id: authData.id,
    username: authData.username ?? username,
    full_name: authData.full_name ?? full_name,
    token: authData.token,
    is_delegated: authData.is_delegated,
    roles: {
      own: authData.roles,
      delegated: [],
    },
  };

  const validatedUser = AuthUserSchema.parse(normalized);
  return enrichUser(validatedUser);
};
