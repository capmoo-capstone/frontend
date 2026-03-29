import api from '@/lib/axios';

import {
  type AddDelegationRequest,
  AddDelegationSchema,
  type AddUsersToUnitRequest,
  AddUsersToUnitSchema,
  type BackendUpdateUserRoleResponse,
  BackendUpdateUserRoleResponseSchema,
  type BackendUserDelegationDetailResponse,
  type BackendUserDelegationResponse,
  type BackendUserDetailResponse,
  BackendUserDetailResponseSchema,
  BackendUserSelectionResponseSchema,
  type GetUsersParams,
  type GetUsersSelectionParams,
  type UpdateUserRoleRequest,
  UpdateUserRoleSchema,
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

export const addUsersToUnit = async (request: AddUsersToUnitRequest): Promise<any> => {
  const data = AddUsersToUnitSchema.parse(request);
  const response = await api.patch(`/users/add-unit/${data.unitId}`, {
    users: data.userId,
  });
  return response;
};

export const addRepresentativeToUnit = async (
  userId: string,
  unitId: string
): Promise<BackendUpdateUserRoleResponse> => {
  const { data } = await api.patch(`/users/${userId}/rep/${unitId}`);
  const parsed = BackendUpdateUserRoleResponseSchema.parse(data);
  return parsed;
};

export const updateUserRole = async (
  request: UpdateUserRoleRequest
): Promise<BackendUpdateUserRoleResponse> => {
  const data = UpdateUserRoleSchema.parse(request);
  const response = await api.patch(`/users/${data.userId}/role`, {
    role: data.role,
    dept_id: data.deptId,
    unit_id: data.unitId,
  });
  const parsed = BackendUpdateUserRoleResponseSchema.parse(response.data);
  return parsed;
};

export const removeUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const addDelegation = async (
  request: AddDelegationRequest
): Promise<BackendUserDelegationResponse> => {
  const data = AddDelegationSchema.parse(request);
  const response = await api.post(`/delegations`, data);
  return response.data;
};

export const cancelDelegation = async (
  delegationId: string
): Promise<BackendUserDelegationResponse> => {
  const response = await api.patch(`/delegations/${delegationId}`);
  return response.data;
};

export const getDelegationById = async (
  delegationId: string
): Promise<BackendUserDelegationDetailResponse> => {
  const response = await api.get(`/delegations/${delegationId}`);
  return response.data;
};
