import { MOCK_USER, MOCK_USERS_BY_ROLE, MOCK_USER_SELECTION } from '@/api/mock-data';
import api from '@/lib/axios';
import { type UserListResponse, UserListResponseSchema } from '@/types/user';
import { type UserSelectionResponse, UserSelectionResponseSchema } from '@/types/user';

import type { User } from '../types';
import {
  AuthUserSchema,
  BackendLoginResponseSchema,
  type GetUsersParams,
  type GetUsersSelectionParams,
  LoginRequestSchema,
  enrichUser,
} from '../types';

export const getMe = async (): Promise<User> => {
  // return mock data
  return enrichUser(MOCK_USER);

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
  // return mock data
  return MOCK_USER_SELECTION;

  const { data } = await api.get('/users/selection', {
    params,
  });

  return UserSelectionResponseSchema.parse(data);
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
  const mockUser = MOCK_USERS_BY_ROLE[role] || MOCK_USER;
  return enrichUser(mockUser);
};
