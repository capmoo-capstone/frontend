import api from '@/lib/axios';
import type { User } from '@/types/auth';
import {
  AuthUserSchema,
  BackendLoginResponseSchema,
  LoginRequestSchema,
  enrichUser,
} from '@/types/auth';
import { type UserListResponse, UserListResponseSchema } from '@/types/user';
import { type UserSelectionResponse, UserSelectionResponseSchema } from '@/types/user';

import { MOCK_USER, MOCK_USERS_BY_ROLE, MOCK_USER_SELECTION } from './mock-data';

interface GetUsersParams {
  page?: number;
  limit?: number;
}

export const getMe = async (): Promise<User> => {
  // return mock data
  return enrichUser(MOCK_USER);

  const { data } = await api.get('/user/me');

  // Parse and enrich the user data
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

type GetUsersSelectionParams =
  | { unit_id: string; department_id?: never }
  | { unit_id?: never; department_id: string };

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
