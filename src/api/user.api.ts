import api from '@/lib/axios';
import { type UserListResponse, UserListResponseSchema } from '@/types/user';
import { type UserSelectionResponse, UserSelectionResponseSchema } from '@/types/user';

import { MOCK_USER_SELECTION } from './mock-data';

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
  return MOCK_USER_SELECTION;

  const { data } = await api.get('/users/selection', {
    params,
  });

  return UserSelectionResponseSchema.parse(data);
};
