import api from '@/lib/axios';

import {
  AuthUserSchema,
  BackendLoginResponseSchema,
  LoginRequestSchema,
  type User,
  enrichUser,
} from '../types';

const toAuthUser = (
  authData: ReturnType<typeof BackendLoginResponseSchema.parse>,
  fallback?: { username: string; full_name: string }
) => {
  return {
    id: authData.id,
    username: authData.username ?? fallback?.username ?? '',
    full_name: authData.full_name ?? fallback?.full_name ?? '',
    token: authData.token,
    is_delegated: authData.is_delegated,
    roles: authData.roles,
  };
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/auth/me');
  const parsed = BackendLoginResponseSchema.parse(data);
  const normalized = toAuthUser(parsed);

  const validatedUser = AuthUserSchema.parse(normalized);
  return enrichUser(validatedUser);
};

export const login = async (username: string, full_name: string): Promise<User> => {
  const payload = LoginRequestSchema.parse({ username, full_name });
  const data = await api.post('/auth/login', payload);
  const parsed = BackendLoginResponseSchema.parse(data);
  const normalized = toAuthUser(parsed, { username, full_name });

  const validatedUser = AuthUserSchema.parse(normalized);
  return enrichUser(validatedUser);
};
