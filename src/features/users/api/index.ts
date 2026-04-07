import api from '@/lib/axios';

import {
  type AddDelegationRequest,
  AddDelegationSchema,
  type BackendUpdateUserRoleResponse,
  BackendUpdateUserRoleResponseSchema,
  type BackendUserDelegationDetailResponse,
  BackendUserDelegationDetailResponseSchema,
  type BackendUserDelegationResponse,
  BackendUserDelegationResponseSchema,
  type BackendUserDetailResponse,
  BackendUserDetailResponseSchema,
  BackendUserSelectionResponseSchema,
  type GetUsersParams,
  type GetUsersSelectionParams,
  type UpdateUserRoleRequest,
  UpdateUserRoleSchema,
  type UpdateUsersToUnitRequest,
  UpdateUsersToUnitSchema,
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

export const getUserById = async (userId: string): Promise<BackendUserDetailResponse> => {
  const { data } = await api.get(`/users/${userId}`);
  const parsed = BackendUserDetailResponseSchema.parse(data);
  return parsed;
};

export const updateUsersInUnit = async (request: UpdateUsersToUnitRequest): Promise<any> => {
  const requestData = UpdateUsersToUnitSchema.parse(request);
  const { data } = await api.patch(`/units/${requestData.unitId}/users`, {
    new_users: requestData.newUserIds,
    remove_users: requestData.removeUserIds,
  });
  return data;
};

export const updateRepresentative = async (
  userId: string,
  unitId: string
): Promise<BackendUpdateUserRoleResponse> => {
  const { data } = await api.patch(`/units/${unitId}/rep/${userId}`);
  const parsed = BackendUpdateUserRoleResponseSchema.parse(data);
  return parsed;
};

export const updateUserRole = async (
  request: UpdateUserRoleRequest
): Promise<BackendUpdateUserRoleResponse> => {
  const requestData = UpdateUserRoleSchema.parse(request);
  const { data } = await api.patch(`/users/${requestData.userId}/role`, {
    role: requestData.role,
    dept_id: requestData.deptId,
    unit_id: requestData.unitId,
  });
  const parsed = BackendUpdateUserRoleResponseSchema.parse(data);
  return parsed;
};

export const removeUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const addDelegation = async (
  request: AddDelegationRequest
): Promise<BackendUserDelegationResponse> => {
  const requestData = AddDelegationSchema.parse(request);
  const { data } = await api.post(`/delegations`, requestData);
  const parsed = BackendUserDelegationResponseSchema.parse(data);
  return parsed;
};

export const cancelDelegation = async (
  delegationId: string
): Promise<BackendUserDelegationResponse> => {
  const { data } = await api.patch(`/delegations/${delegationId}/cancel`);
  const parsed = BackendUserDelegationResponseSchema.parse(data);
  return parsed;
};

export const getDelegationById = async (
  delegationId: string
): Promise<BackendUserDelegationDetailResponse> => {
  const { data } = await api.get(`/delegations/${delegationId}`);
  const parsed = BackendUserDelegationDetailResponseSchema.parse(data);
  return parsed;
};

export const getActiveDelegationByUnit = async (
  unitId: string
): Promise<BackendUserDelegationDetailResponse> => {
  const { data } = await api.get(`/delegations/active?unitId=${unitId}`);
  console.log('getActiveDelegationByUnit response', data);
  const parsed = BackendUserDelegationDetailResponseSchema.parse(data);
  console.log('getActiveDelegationByUnit parsed', parsed);
  return parsed;
};
