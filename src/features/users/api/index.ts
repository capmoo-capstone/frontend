import api from '@/lib/axios';

import {
  type AddUsersToUnitRequest,
  AddUsersToUnitSchema,
  type BackendUserDetailResponse,
  BackendUserDetailResponseSchema,
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

export const getUserById = async (userId: string): Promise<BackendUserDetailResponse> => {
  const { data } = await api.get(`/users/${userId}`);
  const parsed = BackendUserDetailResponseSchema.parse(data);
  return parsed;
};

export const addUsersToUnit = async ({ unitId, userId }: AddUsersToUnitRequest) => {
  const data = AddUsersToUnitSchema.parse({ unitId, userId });
  const response = await api.patch(`/users/add-unit/${data.unitId}`, {
    users: data.userId,
  });
  return response;
};
