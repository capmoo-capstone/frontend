import api from '@/lib/axios';
import type { User } from '@/types/auth';
import { type UserListResponse, UserListResponseSchema } from '@/types/user';
import { type UserSelectionResponse, UserSelectionResponseSchema } from '@/types/user';

import {
  MOCK_USER,
  MOCK_USERS_BY_ROLE,
  MOCK_USER_DEPARTMENT_SELECTION,
  MOCK_USER_SELECTION,
} from './mock-data';

interface GetUsersParams {
  page?: number;
  limit?: number;
}

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
  if (params.unit_id) {
    return MOCK_USER_SELECTION;
  } else if (params.department_id === 'department_procure') {
    return MOCK_USER_DEPARTMENT_SELECTION;
  }

  const { data } = await api.get('/users/selection', {
    params,
  });

  return UserSelectionResponseSchema.parse(data);
};

export const login = async (cunet: string, password: string): Promise<User> => {
  return MOCK_USER;

  const { data } = await api.post('/auth/login', { cunet, password });
  return data;
};

export const devLogin = async (role: string): Promise<User> => {
  return MOCK_USERS_BY_ROLE[role] || MOCK_USER;
};

export const getUserById = async (userId: string): Promise<User> => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const delegateUser = async (
  unitId: string | undefined,
  userId: string,
  startDate: Date,
  endDate?: Date,
  role?: string
) => {
  // return mock response
  return {
    success: true,
    unitId,
    userId,
    startDate,
    endDate: endDate ?? null,
    role,
  };

  const { data } = await api.post('/users/delegate', {
    unit_id: unitId,
    user_id: userId,
    start_date: startDate.toISOString(),
    end_date: endDate ? endDate.toISOString() : null, // error because of mock data
    role,
  });

  return data;
};
