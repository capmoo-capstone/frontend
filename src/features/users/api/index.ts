import api from '@/lib/axios';

import {
  BackendUserSelectionResponseSchema,
  type GetUsersParams,
  type GetUsersSelectionParams,
  type UserListResponse,
  UserListResponseSchema,
  type UserSelectionResponse,
  UserSelectionResponseSchema,
} from '../types';

export const getUsers = async ({
  page = 1,
  limit = 10,
}: GetUsersParams): Promise<UserListResponse> => {
  const { data } = await api.get('/users', {
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
