import api from '@/lib/axios';
import {
  type UserListResponse,
  UserListResponseSchema,
  type UserSelectionResponse,
  UserSelectionResponseSchema,
} from '@/types/user';

import type { User } from '../types';
import {
  AuthUserSchema,
  BackendLoginResponseSchema,
  BackendUserSelectionResponseSchema,
  type GetUsersParams,
  type GetUsersSelectionParams,
  LoginRequestSchema,
  enrichUser,
} from '../types';

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/user/me');

  const validatedUser = AuthUserSchema.parse(data.data);
  return enrichUser(validatedUser);
};

export const getUsers = async ({
  page = 1,
  limit = 10,
}: GetUsersParams): Promise<UserListResponse> => {
  const { data } = await api.get('/user', {
    params: {
      page,
      limit,
    },
  });

  return UserListResponseSchema.parse(data);
};

export const getUsersForSelection = async (
  params: GetUsersSelectionParams
): Promise<UserSelectionResponse> => {
  const { data } = await api.get('/users', {
    params,
  });

  const parsed = BackendUserSelectionResponseSchema.parse(data);

  const normalized = {
    id: parsed.id,
    name: parsed.name,
    entity_type: parsed.entity_type === 'all' ? 'department' : parsed.entity_type,
    data: parsed.data.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      role: user.roles[0] ?? 'GUEST',
    })),
  };

  return UserSelectionResponseSchema.parse(normalized);
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

export const devLogin = async (role: string): Promise<User> => {
  return login(role, role);
};
